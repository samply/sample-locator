import {Component, OnInit} from '@angular/core';
import {FeatureService} from 'src/app/service/feature.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public featureService: FeatureService) {}
  title = 'sample-locator';

  ngOnInit(): void {
    if (this.featureService.brandingUI() === 'GBA') {
      document.title = 'Sample Locator';
      const favIcon: HTMLLinkElement = document.querySelector('#appIcon');
      favIcon.href = '../assets/img/favicon.ico';
    }
    if (this.featureService.brandingUI() === 'BBMRI') {
      document.title = 'BBMRI Locator';
      const favIcon: HTMLLinkElement = document.querySelector('#appIcon');
      favIcon.href = '../assets/img/favicon_BBMRI.png';
    }
  }
}
