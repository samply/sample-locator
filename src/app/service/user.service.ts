import {Injectable} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {SlStorageService} from './sl-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isAuthorized = false;
  private userData: any;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private slStorageService: SlStorageService
  ) {
    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }

    this.oidcSecurityService.getIsAuthorized().subscribe(
      auth => this.isAuthorized = auth
    );

    this.oidcSecurityService.getUserData().subscribe(userData => {
      this.userData = userData;
    });
  }

  private doCallbackLogicIfRequired() {
    if (window.location.hash) {
      this.oidcSecurityService.authorizedImplicitFlowCallback();
    }
  }

  logout() {
    this.slStorageService.setAppAction('logoff');
    this.oidcSecurityService.logoff();
  }

  login() {
    this.slStorageService.setAppAction('login');
    this.oidcSecurityService.authorize();
  }

  getLoginValid(): boolean {
    if (!this.isAuthorized || !this.userData) {
      return false;
    }

    return this.isAuthorized;
  }

  public getIdToken(): string {
    return this.oidcSecurityService.getIdToken();
  }

  getUserName(): string {
    if (!this.isAuthorized || !this.userData) {
      return '';
    }

    return this.userData.hasOwnProperty('preferred_username') ? this.userData.preferred_username : '';
  }

  getRealName(): string {
    if (!this.isAuthorized || !this.userData) {
      return '';
    }

    return this.userData.hasOwnProperty('name') ? this.userData.name : '';
  }
}
