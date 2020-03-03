import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';

import {faEdit, faPaperPlane, faSyncAlt, faTimes, faUser, faVial} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faSquare} from '@fortawesome/free-regular-svg-icons';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, of, Subscription, timer} from 'rxjs';
import {ResultService} from '../../service/result.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';
import {ReplySiteDto} from '../../model/result/reply-dto';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss']
})
export class SimpleResultComponent implements OnInit, OnDestroy {

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    private simpleResultService: ResultService,
    private externalUrlService: ExternalUrlService,
    public userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  // TODO: Set to 60 seconds after testing
  static MAX_TIME_POLLING = 10;
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

  negotiateFlags: Map<string, boolean> = new Map();

  private subscriptions: Array<Subscription> = [];

  resultColumns = [
    {field: 'site', header: 'Biobank'},
    {field: 'sample', header: 'Samples'},
    {field: 'donor', header: 'Donors'}
  ];

  ngOnInit(): void {
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
    this.subscriptions.push(interval(SimpleResultComponent.POLLING_INTERVAL * 1000)
      .pipe(
        takeUntil(timer(SimpleResultComponent.MAX_TIME_POLLING * 1000)),
        startWith(0),
        switchMap(() => {
          if (this.id) {
            this.elapsedSeconds += SimpleResultComponent.POLLING_INTERVAL;
            this.elapsedTimePercentage = Math.min(100 * this.elapsedSeconds / SimpleResultComponent.MAX_TIME_POLLING, 100);

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
    this.router.navigate(['search', {id: this.id}]);
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
}
