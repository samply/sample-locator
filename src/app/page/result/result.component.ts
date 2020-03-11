import * as js2xmlparser from 'js2xmlparser';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';

import {faEdit, faPaperPlane, faSyncAlt, faTimes, faUser, faVial} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquare} from '@fortawesome/free-regular-svg-icons';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
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
  selector: 'app-simple-result',
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
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  static MAX_TIME_POLLING = 60;
  static POLLING_INTERVAL = 1;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;
  faSyncAlt = faSyncAlt;
  faSample = faVial;
  faDonor = faUser;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  detailedResult: Array<ReplySiteDto> = [];

  sumDonors = 0;
  sumSamples = 0;
  biobanksAnswered = 0;
  limitBiobanksAnswered = 0;

  elapsedSeconds = 0;
  elapsedTimePercentage = 0;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  private id = -1;
  private nToken: string;

  negotiateFlags: Map<string, boolean> = new Map();

  private subscriptions: Array<Subscription> = [];

  resultColumns = [
    {field: 'site', header: 'Biobank'},
    {field: 'sample', header: 'Samples'},
    {field: 'donor', header: 'Donors'}
  ];

  ngOnInit(): void {
    this.slStorageService.setAppTargetRoute('result');

    this.initParameters();
    this.initPolling();
    this.initNumberBiobanks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private initParameters() {
    this.subscriptions.push(this.route.params.subscribe(parms => {
      this.id = parms.id;
      this.nToken = parms.nToken;
      this.slStorageService.setNToken(this.nToken);

      if (this.slStorageService.getAppAction() === 'sendQuery') {
        this.sendQuery();
      } else {
        this.queryProviderService.restoreQuery(this.nToken);
      }

      this.slStorageService.resetAppAction();
    }));
  }

  private initNumberBiobanks() {
    this.subscriptions.push(
      this.simpleResultService.getNumberOfBiobanks().subscribe(
        response => this.limitBiobanksAnswered = Number(response.headers.get('size'))
      )
    );
  }

  private initPolling() {
    this.subscriptions.push(interval(ResultComponent.POLLING_INTERVAL * 1000)
      .pipe(
        takeUntil(timer(ResultComponent.MAX_TIME_POLLING * 1000)),
        startWith(0),
        switchMap(() => {
          // TODO: Change: id -> nToken
          if (this.id) {
            this.elapsedSeconds += ResultComponent.POLLING_INTERVAL;
            this.elapsedTimePercentage = Math.min(100 * this.elapsedSeconds / ResultComponent.MAX_TIME_POLLING, 100);

            return this.simpleResultService.getResult(this.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        response => {
          if (response) {
            const result = JSON.parse(response.headers.get('reply')) as Array<ReplySiteDto>;
            if (!this.userService.getLoginValid() || this.isResultAnonymous(result)) {
              this.handleAnonymousResult(result);
            } else {
              this.detailedResult = result;
            }
          }
        }
      )
    );
  }

  private handleAnonymousResult(result: Array<ReplySiteDto>) {
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
    if (result.length === 0) {
      return true;
    }

    for (const reply of result) {
      if (reply.site.toUpperCase() === 'ANONYMOUS') {
        return true;
      }
    }

    return false;
  }

  editQuery() {
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH, {nToken: this.nToken}]);
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  getProcessingMessage() {
    if (this.isPolling()) {
      return 'Processing ...';
    } else {
      return 'Processing stopped';
    }
  }

  refreshPolling() {
    if (!this.isPolling()) {
      // Start polling once more as it has stopped before results where allowed to be polled with authorisation
      this.elapsedTimePercentage = 0;
      this.elapsedSeconds = 0;
      this.initPolling();
    }
  }

  getRefreshButtonClass() {
    return this.isPolling() ? 'result-page-button result-page-button-inactive' : 'result-page-button';
  }

  isPolling() {
    return this.elapsedTimePercentage < 100;
  }

  navigateToNegotiator() {
    if (!this.isAnyNegotiateFlagChecked()) {
      return;
    }

    // TODO: Implement routing with molgenis credentials
    console.log('Start negotiation');
  }

  getNegotiatorButtonClass() {
    return this.isAnyNegotiateFlagChecked() ? 'result-page-button' : 'result-page-button result-page-button-inactive';
  }

  getNegotiateIcon(site: string): any {
    return (this.negotiateFlags.has(site) && this.negotiateFlags.get(site)) ? this.faCheckSquare : this.faSquare;
  }

  toggleNegotiateFlag(site: string): void {
    if (this.negotiateFlags.has(site)) {
      this.negotiateFlags.set(site, !this.negotiateFlags.get(site));
    } else {
      this.negotiateFlags.set(site, true);
    }
  }

  private isAnyNegotiateFlagChecked() {
    for (const site of this.negotiateFlags.keys()) {
      if (this.negotiateFlags.get(site)) {
        return true;
      }
    }

    return false;
  }

  private sendQuery() {
    const xml = js2xmlparser.parse('essentialSimpleQueryDto', this.queryProviderService.query);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/xml')
      .set('Accept', 'application/xml');
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';

    this.httpClient.post<EssentialSimpleFieldDto>(url, xml, {headers, observe: 'response'}).subscribe(
      dataElement => {
        this.id = parseInt(dataElement.headers.get('id'), 10);
      }
    );
  }
}
