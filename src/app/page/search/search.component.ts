import { Component, OnInit } from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto} from '../../model/query/essential-query-dto';
import {ExtendedMdrFieldDto} from '../../model/mdr/extended-mdr-field-dto';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService
  ) { }

  ngOnInit(): void {
  }

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field.urn);
  }
}
