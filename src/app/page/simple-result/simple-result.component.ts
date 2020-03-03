import {Component, OnDestroy, OnInit} from '@angular/core';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';

import {faEdit, faPaperPlane, faTimes} from '@fortawesome/free-solid-svg-icons';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {interval, of, Subscription, timer} from 'rxjs';
import {SimpleResultService} from '../../simple-result.service';
import {startWith, switchMap, takeUntil} from 'rxjs/operators';
import {ReplySiteDto} from '../../model/result/reply-dto';

@Component({
  selector: 'app-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss']
})
export class SimpleResultComponent implements OnInit, OnDestroy {

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    private simpleResultService: SimpleResultService,
    private externalUrlService: ExternalUrlService,
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

  result: Array<ReplySiteDto>;

  sumDonors = 0;
  sumSamples = 0;
  biobanksAnswered = 0;
  limitBiobanksAnswered = 0;

  elapsedSeconds = 0;
  elapsedTimePercentage = 0;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];
  private id = -1;

  private subscriptions: Array<Subscription> = [];

  ngOnInit(): void {
    this.initParameters();
    this.initPolling();
    this.initNumberBiobanks();
  }

  private initParameters() {
    this.subscriptions.push(this.route.params.subscribe(parms => {
      this.id = parms.id;
    }));
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

            console.log(result);
          }
        }
      )
    );
  }

  private initNumberBiobanks() {
    this.subscriptions.push(
      this.simpleResultService.getNumberOfBiobanks().subscribe(
        response => this.limitBiobanksAnswered = Number(response.headers.get('size'))
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  editQuery() {
    this.router.navigate(['search', {id: this.id}]);
  }

  getProcessingMessage() {
    if (this.elapsedTimePercentage < 100) {
      return 'Processing ...';
    } else {
      return 'Processing finished';
    }
  }
}
