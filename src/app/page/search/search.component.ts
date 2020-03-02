import {Component, OnInit, ViewChildren} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExtendedMdrFieldDto, MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto} from '../../model/query/essential-query-dto';

import {faEdit, faPaperPlane, faTimes} from '@fortawesome/free-solid-svg-icons';

import * as js2xmlparser from 'js2xmlparser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ExternalUrlService} from '../../service/external-url.service';
import {SearchBuilderComponent} from '../../component/search-builder/search-builder.component';

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

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {
  }

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field['@'].urn);
  }

  sendQuery() {
    const xml = js2xmlparser.parse('essentialSimpleQueryDto', this.queryProviderService.query);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/xml')
      .set('Accept', 'application/xml');
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/sendQuery';

    const httpOptions = {
      headers
    };

    this.httpClient.post<EssentialSimpleFieldDto>(url, xml, httpOptions).subscribe(
      dataElement => {
        console.log(dataElement);
      }
    );
  }

  resetQuery() {
    this.queryProviderService.resetQuery();
    this.builderComponents.forEach(component => component.calculateFilteredFields());
  }
}
