import {v4 as uuidv4} from 'uuid';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';

import {faEdit, faPaperPlane, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {interval, of, Subscription, timer} from 'rxjs';
import {ResultService} from '../../service/result.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';
import {Reply, ReplySite, Stratification} from '../../model/result/reply-dto';
import {UserService} from '../../service/user.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    private resultService: ResultService,
    private externalUrlService: ExternalUrlService,
    public userService: UserService,
    private queryProviderService: QueryProviderService,
    private slStorageService: SlStorageService,
    private httpClient: HttpClient,
    private router: Router
  ) {
  }

  static MAX_TIME_POLLING = 300;
  static POLLING_INTERVAL = 1;

  static TIME_LIMIT_PROCESSING_BAR = 60;
  static TIME_STEP_DECI_SECOND = 0.1;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  detailedResult: Reply = {replySites: []};
  aggregatedResult: ReplySite = this.createEmptyAggregatedResult();

  biobanksAnswered = 0;

  limitBiobanksAnswered = 0;
  elapsedPercentage = 0;
  showProcessingBar = true;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  private nToken: string;

  private subscriptions: Array<Subscription> = [];

  // noinspection JSMethodCanBeStatic
  private createEmptyAggregatedResult(): ReplySite {
    return {
      site: 'anonymous',
      donor: {
        count: 0,
        label: 'Donor',
        stratifications: []
      },
      sample: {
        count: 0,
        label: 'Sample',
        stratifications: []
      }
    };
  }

  ngOnInit(): void {
    this.slStorageService.setAppTargetRoute('result');
    this.queryProviderService.restoreQuery();

    this.scrollTop();
    this.initNToken();

    this.sendQuery();
    this.initProgressBar();
    this.initPolling();
    this.initNumberBiobanks();
  }

  private sendQuery(): void {
    if (this.slStorageService.getAppAction() !== 'sendQuery') {
      return;
    }
    this.slStorageService.resetAppAction();

    const headers = new HttpHeaders()
      .set('Accept', 'text/plain; charset=utf-8');
    let url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';
    if (this.nToken) {
      url += '?ntoken=' + this.nToken;
    }

    this.subscriptions.push(
      this.httpClient.post<any>(url, this.queryProviderService.query, {headers}).subscribe(
        response => {
          // Subscribe to activate POST request
          console.log('Send query and received id ' + parseInt(response, 10));
        },
        error => {
          if (error instanceof HttpErrorResponse && error.status === 202) {
            console.log('Request is accepted but not handled, yet');
          } else {
            console.log(error);
          }
        }
      )
    );
  }

  private initNToken() {
    this.nToken = this.slStorageService.getNToken();

    if (!this.nToken) {
      this.nToken = this.generateNToken();
    }
  }

  private generateNToken(): string {
    const nToken = uuidv4() + '__search_' + uuidv4();
    this.slStorageService.setNToken(nToken);

    return nToken;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private initNumberBiobanks() {
    this.subscriptions.push(
      this.resultService.getNumberOfBiobanks().subscribe(
        response => this.limitBiobanksAnswered = Number(response)
      )
    );
  }

  private initProgressBar() {
    this.elapsedPercentage = 0;
    this.showProcessingBar = true;

    this.subscriptions.push(
      interval(ResultComponent.TIME_STEP_DECI_SECOND * 1000).pipe(
        takeUntil(timer(ResultComponent.TIME_LIMIT_PROCESSING_BAR * 1000)),
        startWith(0)
      ).subscribe((value) => {
          this.elapsedPercentage = value * 10 / ResultComponent.TIME_LIMIT_PROCESSING_BAR;
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.showProcessingBar = false;
        }
      )
    );
  }

  private initPolling() {
    this.subscriptions.push(interval(ResultComponent.POLLING_INTERVAL * 1000)
      .pipe(
        takeUntil(timer(ResultComponent.MAX_TIME_POLLING * 1000)),
        startWith(0),
        switchMap(() => {
          if (this.nToken) {
            return this.resultService.getResult(this.nToken);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        response => {
          if (response) {
            const result = response as Reply;
            this.calculateAggregatedResult(result);

            if (this.userService.getLoginValid() && !this.isResultAnonymous(result)) {
              this.detailedResult = result;
            }
          }
        },
        (error => {
            if (error instanceof HttpErrorResponse && error.status === 403) {
              console.log('Unauthorized: No access to detailed results');
              this.userService.logout();
            } else {
              console.log(error);
            }
          }
        )
      )
    );
  }

  private calculateAggregatedResult(result: Reply) {
    const aggregatedResultTemp: ReplySite = this.createEmptyAggregatedResult();

    let biobanksAnsweredTemp = 0;

    if (result) {
      for (const reply of result.replySites) {
        aggregatedResultTemp.donor.count += reply.donor.count;
        aggregatedResultTemp.sample.count += reply.sample.count;
        biobanksAnsweredTemp++;

        this.aggregateStratificationDonor(reply, aggregatedResultTemp);
        this.aggregateStratificationSample(reply, aggregatedResultTemp);
      }

      for (const reply of result.replySites) {
        aggregatedResultTemp.donor.count += reply.donor.count;
        aggregatedResultTemp.sample.count += reply.sample.count;
        biobanksAnsweredTemp++;

        this.aggregateStratificationDonor(reply, aggregatedResultTemp);
        this.aggregateStratificationSample(reply, aggregatedResultTemp);
      }
    }

    this.aggregatedResult = aggregatedResultTemp;
    this.biobanksAnswered = biobanksAnsweredTemp;
  }

  private aggregateStratificationDonor(reply, aggregatedResultTemp: ReplySite) {
    for (const stratification of reply.donor.stratifications) {
      let aggregatedStratification = aggregatedResultTemp.donor.stratifications.find(
        stratificationTemp => stratificationTemp.title === stratification.title
      );
      if (!aggregatedStratification) {
        aggregatedStratification = {title: stratification.title, strata: []};
        aggregatedResultTemp.donor.stratifications.push(aggregatedStratification);
      }
      this.aggregateStrata(stratification, aggregatedStratification);
    }
  }

  private aggregateStratificationSample(reply, aggregatedResultTemp: ReplySite) {
    for (const stratification of reply.sample.stratifications) {
      let aggregatedStratification = aggregatedResultTemp.sample.stratifications.find(
        stratificationTemp => stratificationTemp.title === stratification.title
      );
      if (!aggregatedStratification) {
        aggregatedStratification = {title: stratification.title, strata: []};
        aggregatedResultTemp.sample.stratifications.push(aggregatedStratification);
      }
      this.aggregateStrata(stratification, aggregatedStratification);
    }
  }

  private aggregateStrata(stratification: Stratification, aggregatedStratification: Stratification) {
    for (const stratum of stratification.strata) {
      const aggregatedStratum = aggregatedStratification.strata.find(stratumTemp => stratumTemp.label === stratum.label);
      if (aggregatedStratum) {
        aggregatedStratum.count += stratum.count;
      } else {
        aggregatedStratification.strata.push({label: stratum.label, count: stratum.count});
      }
    }
  }

  isResultAnonymous(result: Reply = this.detailedResult): boolean {
    if (!result || !result.replySites) {
      return true;
    }

    for (const reply of result.replySites) {
      if (reply.site.toUpperCase() === 'ANONYMOUS') {
        return true;
      }
    }

    return false;
  }

  editQuery() {
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  // noinspection JSMethodCanBeStatic
  private scrollTop() {
    if (window.document) {
      if (window.document.scrollingElement) {
        window.document.scrollingElement.scrollTop = 0;
      } else if (window.document.documentElement) {
        window.document.documentElement.scrollTop = 0;
      }
    }
  }
}
