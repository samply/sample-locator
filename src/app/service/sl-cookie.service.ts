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
    console.log('SET cookie');
    this.cookieService.set(
      SlCookieService.CONSENT_COOKIE_NAME,
      'TRUE',
      new Date('2099-12-31'),
      '/',
      null,
      false,
      'Lax');
  }
}
