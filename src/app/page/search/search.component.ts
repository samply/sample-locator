import {v4 as uuidv4} from 'uuid';

import {Component, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {QueryProviderService} from '../../service/query-provider.service';
import {faEdit, faPaperPlane, faTimes} from '@fortawesome/free-solid-svg-icons';
import {HttpClient} from '@angular/common/http';
import {ExternalUrlService} from '../../service/external-url.service';
import {SearchBuilderComponent} from '../../component/search-builder/search-builder.component';
import {ActivatedRoute, Router} from '@angular/router';
import {SlStorageService} from '../../service/sl-storage.service';
import {Subscription} from 'rxjs';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  @ViewChildren(SearchBuilderComponent)
  builderComponents: Array<SearchBuilderComponent>;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  private nToken: string;

  private subscriptions: Array<Subscription> = [];

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private slStorageService: SlStorageService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // Avoid automatic setting after login before routing to LoggedInComponent
    if (this.slStorageService.getAppAction() !== 'login' && this.slStorageService.getAppAction() !== 'logoff') {
      this.slStorageService.setAppTargetRoute('search');
    }
    this.initParameters();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private initParameters() {
    this.subscriptions.push(this.route.params.subscribe(parms => {
      this.nToken = parms.nToken;
      this.slStorageService.setNToken(this.nToken);

      this.queryProviderService.restoreQuery(this.nToken);
    }));
  }

  sendQuery() {
    this.slStorageService.setAppAction('sendQuery');

    if (!this.nToken) {
      this.nToken = this.generateNToken();
    }

    this.router.navigate([SampleLocatorConstants.ROUTE_RESULT, {nToken: this.nToken}]);
  }


  private generateNToken(): string {
    const nToken = uuidv4() + '__search_' + uuidv4();
    this.slStorageService.setNToken(nToken);

    return nToken;
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.builderComponents.forEach(component => component.calculateFilteredFields());
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }
}
