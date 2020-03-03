import {Component, OnInit, ViewChildren} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto} from '../../model/query/essential-query-dto';
import {faEdit, faPaperPlane, faTimes} from '@fortawesome/free-solid-svg-icons';
import * as js2xmlparser from 'js2xmlparser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ExternalUrlService} from '../../service/external-url.service';
import {SearchBuilderComponent} from '../../component/search-builder/search-builder.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @ViewChildren(SearchBuilderComponent)
  builderComponents: Array<SearchBuilderComponent>;

  faTimes = faTimes;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  editDisabled = false;

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private httpClient: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  sendQuery() {
    this.editDisabled = true;

    this.builderComponents.forEach(component => component.calculateFilteredFields());

    const xml = js2xmlparser.parse('essentialSimpleQueryDto', this.queryProviderService.query);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/xml')
      .set('Accept', 'application/xml');
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';

    this.httpClient.post<EssentialSimpleFieldDto>(url, xml, {headers, observe: 'response'}).subscribe(
      dataElement => {
        this.router.navigate(['result', {id: dataElement.headers.get('id')}]);
      }
    );
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.builderComponents.forEach(component => component.calculateFilteredFields());
  }
}
