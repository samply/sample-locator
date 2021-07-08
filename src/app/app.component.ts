import {Component, OnInit} from '@angular/core';
import {FeatureService} from 'src/app/service/feature.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public featureService: FeatureService) {}

  public static brandingTitle: string;

  title = 'sample-locator';

  ngOnInit(): void {
    const favIcon: HTMLLinkElement = document.querySelector('#appIcon');

    if (this.featureService.brandingUI() === 'GBA') {
      AppComponent.brandingTitle = 'Sample Locator';
      favIcon.href = '../assets/img/favicon.ico';
    }
    if (this.featureService.brandingUI() === 'BBMRI') {
      AppComponent.brandingTitle = 'BBMRI Locator';
      favIcon.href = '../assets/img/favicon_BBMRI.png';
    }
    document.title = AppComponent.brandingTitle;
  }
}
