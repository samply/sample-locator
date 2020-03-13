import * as js2xmlparser from 'js2xmlparser';
import {v4 as uuidv4} from 'uuid';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';

import {faEdit, faPaperPlane, faTimes, faUser, faVial, faBuilding} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquare} from '@fortawesome/free-regular-svg-icons';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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
import {NegotiatorService} from '../../service/negotiator.service';

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
    private negotiatorService: NegotiatorService
  ) {
  }

  static MAX_TIME_POLLING = 300;
  static TIME_LIMIT_PROCESSING_BAR = 60;
  static POLLING_INTERVAL = 1;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;
  faSample = faVial;
  faDonor = faUser;
  faBiobank = faBuilding;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  detailedResult: Array<ReplySiteDto> = [];

  sumDonors = 0;
  sumSamples = 0;
  biobanksAnswered = 0;
  limitBiobanksAnswered = 0;

  elapsedSeconds = 0;
  showProcessingBar = true;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

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
    this.queryProviderService.restoreQuery();

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

    const xml = js2xmlparser.parse('essentialSimpleQueryDto', this.queryProviderService.query);

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/xml')
      .set('Accept', 'application/xml');
    if (this.nToken) {
      headers = headers.set('ntoken', this.nToken);
    }

    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';

    this.subscriptions.push(
      this.httpClient.post<EssentialSimpleFieldDto>(url, xml, {headers, observe: 'response'}).subscribe(
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

  private initPolling() {
    this.subscriptions.push(interval(ResultComponent.POLLING_INTERVAL * 1000)
      .pipe(
        takeUntil(timer(ResultComponent.MAX_TIME_POLLING * 1000)),
        startWith(0),
        switchMap(() => {
          if (this.nToken) {
            this.elapsedSeconds += ResultComponent.POLLING_INTERVAL;
            if (this.elapsedSeconds >= ResultComponent.TIME_LIMIT_PROCESSING_BAR) {
              this.showProcessingBar = false;
            }

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
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  navigateToNegotiator() {
    if (!this.isAnyNegotiateFlagChecked()) {
      return;
    }

    const sites: Array<string> = [];
    for (const key of this.negotiateFlags.keys()) {
      if (this.negotiateFlags.get(key)) {
        sites.push(key);
      }
    }

    this.negotiatorService.redirectToNegotiator(sites);
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
}
