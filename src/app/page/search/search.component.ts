import { Component, OnInit } from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(
    private mdrFieldProviderService: MdrFieldProviderService
  ) { }

  ngOnInit(): void {
  }

}
