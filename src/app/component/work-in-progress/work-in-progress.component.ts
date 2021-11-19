import { Component, OnInit } from '@angular/core';
import {FeatureService} from '../../service/feature.service';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-work-in-progress',
  templateUrl: './work-in-progress.component.html',
  styleUrls: ['./work-in-progress.component.scss']
})
export class WorkInProgressComponent implements OnInit {

  constructor(public featureService: FeatureService) { }
  brandingTitle: string;

  ngOnInit(): void {
    this.brandingTitle = AppComponent.brandingTitle;
  }

}
