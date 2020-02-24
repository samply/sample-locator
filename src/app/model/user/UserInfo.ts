export interface UserInfo {
  refreshToken: string;
  userAuthentication: UserAuthentication;
}

export interface UserAuthentication {
  idToken: string;
  username: string;
  realname: string;
  state: string;
  loginValid: boolean;
}
