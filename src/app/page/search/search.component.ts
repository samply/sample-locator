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
import {SampleLocatorConstants} from '../../SampleLocatorConstants';
import {Subscription} from 'rxjs';
import {UserService} from '../../service/user.service';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  static MINIMAL_NUMBER_VALUES_TO_TOP_SHOW_ACTION_BUTTONS = 7;
  private subscriptions: Array<Subscription> = [];

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private slStorageService: SlStorageService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public featureService: FeatureService
  ) {
  }

  @ViewChildren(SearchBuilderComponent)
  builderComponents: Array<SearchBuilderComponent>;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  static scrollToTop() {
    window.scroll({
      top: 0
    });
  }

  ngOnInit(): void {
    // Avoid automatic setting after login before routing to LoggedInComponent
    if (this.slStorageService.getAppAction() !== 'login' && this.slStorageService.getAppAction() !== 'logoff') {
      this.slStorageService.setAppTargetRoute('search');
    }

    this.queryProviderService.restoreQuery();

    this.subscriptions.push(this.route.queryParams.subscribe(parms => {
      if (parms.nToken) {
        this.slStorageService.setNToken(parms.nToken);
      }
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  sendQuery() {
    SearchComponent.scrollToTop();
    this.slStorageService.setAppAction('sendQuery');

    this.router.navigate([SampleLocatorConstants.ROUTE_RESULT]);
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.builderComponents.forEach(component => component.calculateFilteredFields());
    this.slStorageService.setBiobankCollection('');
    this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
  }

  showTopActionButtons() {
    let numberOfValues = 0;
    this.queryProviderService.query.fieldDtos.forEach(fieldDto => numberOfValues += fieldDto.valueDtos.length);
    return numberOfValues >= SearchComponent.MINIMAL_NUMBER_VALUES_TO_TOP_SHOW_ACTION_BUTTONS;
  }
}
