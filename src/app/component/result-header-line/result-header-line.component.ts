import {Component, Input, OnInit} from '@angular/core';
import {faBuilding, faUser, faVial} from '@fortawesome/free-solid-svg-icons';
import {faHandshake} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-result-header-line',
  templateUrl: './result-header-line.component.html',
  styleUrls: ['./result-header-line.component.scss']
})
export class ResultHeaderLineComponent implements OnInit {

  faSample = faVial;
  faDonor = faUser;
  faBiobank = faBuilding;
  faNegotiator = faHandshake;

  @Input()
  isDetailedResult = true;

  @Input()
  biobanksAnswered: number;

  @Input()
  sumDonors: number;

  @Input()
  sumSamples: number;

  constructor() {
  }

  ngOnInit(): void {
  }
}
