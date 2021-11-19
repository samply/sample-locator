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

    AppComponent.brandingTitle = this.featureService.branding().title;
    favIcon.href = '../assets/img/' + this.featureService.branding().favicon;
    this.metaService.addTags([
      // tslint:disable-next-line:max-line-length
      {name: 'description', content: this.featureService.branding().metaDescription}
    ]);

    document.title = AppComponent.brandingTitle;
  }
}
