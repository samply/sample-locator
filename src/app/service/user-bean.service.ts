import {Injectable} from '@angular/core';
import {UserInfo} from '../model/user/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserBeanService {

  private userInfo: UserInfo;

  constructor() {
  }

  logout() {
    this.userInfo = null;
  }

  login() {
    // TODO: Implement authorization logic
    this.userInfo = {
      refreshToken: 'abc',
      userAuthentication: {
        loginValid: true,
        realname: 'Frau Mustermann',
        username: 'frau-mustermann',
        idToken: '123',
        state: 'random'
      }
    };
  }

  getLoginValid(): boolean {
    if (!this.userInfo || !this.userInfo.userAuthentication) {
      return false;
    }

    return this.userInfo.userAuthentication.loginValid;
  }

  getUserName(): string {
    if (!this.userInfo || !this.userInfo.userAuthentication) {
      return '';
    }

    return this.userInfo.userAuthentication.username;
  }

  getRealName(): string {
    if (!this.userInfo || !this.userInfo.userAuthentication) {
      return '';
    }

    return this.userInfo.userAuthentication.realname;
  }
}
