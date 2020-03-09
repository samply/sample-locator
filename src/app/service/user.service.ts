import {Injectable} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isAuthorized = false;
  private userData: any;

  constructor(private oidcSecurityService: OidcSecurityService) {
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
    this.oidcSecurityService.logoff();
  }

  login() {
    this.oidcSecurityService.authorize();
/*    this.oidcSecurityService.authorize((authUrl) => {
      // handle the authorrization URL
      window.open(authUrl, '_blank', 'toolbar=0,location=0,menubar=0');
    });*/
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
