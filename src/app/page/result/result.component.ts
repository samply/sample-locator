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
import {ReplySiteDto} from '../../model/result/reply-dto';
import {UserService} from '../../service/user.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto} from '../../model/query/essential-query-dto';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    private simpleResultService: ResultService,
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

  detailedResult: Array<ReplySiteDto> = [];

  sumDonors = 0;
  sumSamples = 0;
  biobanksAnswered = 0;

  limitBiobanksAnswered = 0;
  elapsedPercentage = 0;
  showProcessingBar = true;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  private nToken: string;

  private subscriptions: Array<Subscription> = [];

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

    const json = JSON.stringify(this.queryProviderService.query);

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    if (this.nToken) {
      headers = headers.set('ntoken', this.nToken);
    }

    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';

    this.subscriptions.push(
      this.httpClient.post<EssentialSimpleFieldDto>(url, json, {headers, observe: 'response'}).subscribe(
        response => {
          // Subscribe to activate POST request
          console.log('Send query and received id ' + parseInt(response.headers.get('id'), 10));
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
      this.simpleResultService.getNumberOfBiobanks().subscribe(
        response => this.limitBiobanksAnswered = Number(response.headers.get('size'))
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
            return this.simpleResultService.getResult(this.nToken);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        response => {
          if (response) {
            const result = JSON.parse(response.headers.get('reply')) as Array<ReplySiteDto>;
            this.calculateResultSums(result);

            if (this.userService.getLoginValid() && !this.isResultAnonymous(result)) {
              this.detailedResult = result;
            }
          }
        },
        (error => {
            if (error instanceof HttpErrorResponse && error.status === 403) {
              console.log('Unauthorized: No access to detailed results');
              this.userService.logout();
            }
          }
        )
      )
    );
  }

  private calculateResultSums(result: Array<ReplySiteDto>) {
    let donorsTemp = 0;
    let samplesTemp = 0;
    let biobanksAnsweredTemp = 0;

    if (result) {
      for (const reply of result) {
        donorsTemp += reply.donor;
        samplesTemp += reply.sample;
        biobanksAnsweredTemp++;
      }
    }

    this.sumDonors = donorsTemp;
    this.sumSamples = samplesTemp;
    this.biobanksAnswered = biobanksAnsweredTemp;
  }

  isResultAnonymous(result = this.detailedResult): boolean {
    for (const reply of result) {
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
