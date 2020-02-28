import {Component, OnInit} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {ExtendedMdrFieldDto, MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto} from '../../model/query/essential-query-dto';

// TODO: Adopt https://stackblitz.com/edit/deep-nested-reactive-form?file=app%2Fapp.component.html
// Help: flex-layout https://tburleson-layouts-demos.firebaseapp.com/#/docs

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  mdrEntitiesDonor = [MdrEntity.DONOR, MdrEntity.EVENT];
  mdrEntitiesSample = [MdrEntity.SAMPLE];

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
  ) {
  }

  ngOnInit(): void {
  }

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field.urn);
  }
}
