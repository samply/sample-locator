import {Component, OnInit} from '@angular/core';
import {SlCookieService} from '../../service/sl-cookie.service';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {

  constructor(private slCookieService: SlCookieService, public featureService: FeatureService) {
  }

  ngOnInit(): void {
  }

  setCookieAccepted(): void {
    this.slCookieService.setConsentCookieAccepted();
  }

  showCookieBanner(): boolean {
    return !this.slCookieService.isConsentCookieAccepted();
  }
}
