import {Component, OnInit} from '@angular/core';
import {FeatureService} from 'src/app/service/feature.service';
import {Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public featureService: FeatureService, private metaService: Meta) {}

  public static brandingTitle: string;

  title = 'sample-locator';

  ngOnInit(): void {
    const favIcon: HTMLLinkElement = document.querySelector('#appIcon');

    if (this.featureService.brandingUI() === 'GBA') {
      AppComponent.brandingTitle = 'Sample Locator';
      favIcon.href = '../assets/img/favicon.ico';
      this.metaService.addTags([
        // tslint:disable-next-line:max-line-length
        {name: 'description', content: 'The Sample Locator enables scientists to search for biosamples and related data across multiple academic biobanks.'}
      ]);
    }
    if (this.featureService.brandingUI() === 'BBMRI') {
      AppComponent.brandingTitle = 'BBMRI Locator';
      favIcon.href = '../assets/img/favicon_BBMRI.png';
      this.metaService.addTags([
        // tslint:disable-next-line:max-line-length
        {name: 'description', content: 'The BBMRI Locator enables scientists to search for biosamples and related data across multiple academic biobanks.'}
      ]);
    }
    document.title = AppComponent.brandingTitle;
  }
}
