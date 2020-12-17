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
import {Reply, ReplySite, ReplyTransfer, Stratification, Stratum} from '../../model/result/reply-dto';
import {UserService} from '../../service/user.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';
import {ReplySiteDto} from '../../model/result/reply-legacy-dto';
import {SearchComponent} from '../search/search.component';

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

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  detailedResult: Reply = {replySites: []};
  aggregatedResult: ReplySite = this.createEmptyAggregatedResult();

  biobanksAnswered = 0;
  biobanksWithStratifications = 0;

  limitBiobanksAnswered = 0;

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
            const replyTransfer = response as ReplyTransfer;

            const reply = this.transformFromLegacyFormat(replyTransfer);
            this.calculateAggregatedResult(reply);

            if (this.userService.getLoginValid() && !this.isResultAnonymous(reply)) {
              this.detailedResult = reply;
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

  private transformFromLegacyFormat(replyTransfer: ReplyTransfer) {
    const reply: Reply = {replySites: []};
    let biobanksWithStratificationsTemp = 0;

    for (const siteTransfer of replyTransfer.replySites) {
      if (ResultComponent.hasLegacyFormat(siteTransfer)) {
        reply.replySites.push(ResultComponent.transformToReplyFormat(siteTransfer as ReplySiteDto));
      } else {
        biobanksWithStratificationsTemp++;
        reply.replySites.push(siteTransfer as ReplySite);
      }
    }

    this.biobanksWithStratifications = biobanksWithStratificationsTemp;
    return reply;
  }

  // noinspection TsLint
  private static hasLegacyFormat(siteTransfer: ReplySite | ReplySiteDto) {
    return (siteTransfer as ReplySite).donor.count === undefined;
  }

  // noinspection TsLint
  private static transformToReplyFormat(siteTransfer: ReplySiteDto): ReplySite {
    return {
      site: siteTransfer.site,
      donor: {
        label: 'Donor',
        count: siteTransfer.donor,
        stratifications: []
      },
      sample: {
        label: 'Sample',
        count: siteTransfer.sample,
        stratifications: []
      }
    };
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
    }

    this.aggregatedResult = aggregatedResultTemp;
    this.biobanksAnswered = biobanksAnsweredTemp;
  }

  private aggregateStratificationDonor(reply, aggregatedResultTemp: ReplySite) {
    for (const stratification of reply.donor.stratifications) {
      let aggregatedStratification: Stratification = aggregatedResultTemp.donor.stratifications.find(
        stratificationTemp => stratificationTemp.title === stratification.title
      );
      if (!aggregatedStratification) {
        aggregatedStratification = {title: stratification.title, strata: this.createEmptyStrata(stratification.title)} as Stratification;
        aggregatedResultTemp.donor.stratifications.push(aggregatedStratification);
      }
      this.aggregateStrata(stratification, aggregatedStratification);
    }
  }

  private createEmptyStrata(title: string): Array<Stratum> {
    if (title === 'Age') {
      return [
        this.createEmptyStratum('0'),
        this.createEmptyStratum('10'),
        this.createEmptyStratum('20'),
        this.createEmptyStratum('30'),
        this.createEmptyStratum('40'),
        this.createEmptyStratum('50'),
        this.createEmptyStratum('60'),
        this.createEmptyStratum('70'),
        this.createEmptyStratum('80'),
        this.createEmptyStratum('90'),
      ];
    }

    if (title === 'Gender') {
      return [
        this.createEmptyStratum('female'),
        this.createEmptyStratum('male'),
      ];
    }

    if (title === 'SampleType') {
      return [
        this.createEmptyStratum('liquid'),
        this.createEmptyStratum('tissue'),
        this.createEmptyStratum('other'),
      ];
    }

    return [];
  }

  private createEmptyStratum(label: string): Stratum {
    return {label, count: 0};
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
      if (stratum.label === 'null') {
        continue;
      }

      const aggregatedStratum = aggregatedStratification.strata.find(stratumTemp => stratumTemp.label === stratum.label);
      if (aggregatedStratum) {
        aggregatedStratum.count += stratum.count;
      } else {
        aggregatedStratification.strata.push({label: stratum.label, count: stratum.count});
      }
    }

    this.transformToPercentage(aggregatedStratification);
  }

  // noinspection JSMethodCanBeStatic
  private transformToPercentage(aggregatedStratification: Stratification) {
    let totalCount = 0;
    for (const stratum of aggregatedStratification.strata) {
      totalCount += stratum.count;
    }

    if (totalCount === 0) {
      return;
    }

    for (const stratum of aggregatedStratification.strata) {
      stratum.count = 100 * stratum.count / totalCount;
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

  showTopActionButtons() {
    let numberOfValues = 0;
    this.queryProviderService.query.fieldDtos.forEach(fieldDto => numberOfValues += fieldDto.valueDtos.length);
    return numberOfValues >= SearchComponent.MINIMAL_NUMBER_VALUES_TO_TOP_SHOW_ACTION_BUTTONS;
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
