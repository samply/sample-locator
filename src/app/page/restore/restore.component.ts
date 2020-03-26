import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {QueryProviderService} from '../../service/query-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {EssentialQueryDto} from '../../model/query/essential-query-dto';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  nToken: string;

  constructor(
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private slStorageService: SlStorageService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initParameters();
  }

  private initParameters() {
    this.subscriptions.push(this.route.queryParams.subscribe(parms => {
      this.nToken = parms.ntoken;
      this.slStorageService.setNToken(this.nToken);

      if (!this.nToken) {
        this.queryProviderService.restoreQuery();
        this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
        return;
      }

      this.initQuery();
    }));
  }

  private initQuery() {
    const url = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/getQuery?ntoken=' + this.nToken;
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    this.subscriptions.push(
      this.httpClient.get(url, {
        responseType: 'json',
        headers
      }).subscribe(
        query => {
          this.slStorageService.setQuery(query as EssentialQueryDto);

          this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
        }
      )
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
