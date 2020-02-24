import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SlCookieService {

  static CONSENT_COOKIE_NAME = 'consent-cookie-accepted';

  constructor(private cookieService: CookieService) {
  }

  isConsentCookieAccepted(): boolean {
    return this.cookieService.check(SlCookieService.CONSENT_COOKIE_NAME)
      && this.cookieService.get(SlCookieService.CONSENT_COOKIE_NAME) === 'TRUE';
  }

  setConsentCookieAccepted(): void {
    this.cookieService.set(SlCookieService.CONSENT_COOKIE_NAME, 'TRUE');
  }

  resetConsentCookieAccepted(): void {
    this.cookieService.set(SlCookieService.CONSENT_COOKIE_NAME, 'FALSE');
  }
}
