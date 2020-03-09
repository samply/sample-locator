import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page/page-not-found/page-not-found.component';
import {SearchComponent} from './page/search/search.component';
import {SimpleResultComponent} from './page/result/simple-result.component';
import {AboutUsComponent} from './page/about-us/about-us.component';
import {ImprintComponent} from './page/imprint/imprint.component';
import {PrivacyPolicyComponent} from './page/privacy-policy/privacy-policy.component';
import {ForbiddenComponent} from './page2/forbidden/forbidden.component';
import {HomeComponent} from './page2/home/home.component';
import {UnauthorizedComponent} from './page2/unauthorized/unauthorized.component';


const routes: Routes = [
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },




  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'search'
  },

  {
    path: 'search',
    component: SearchComponent
  },

  {
    path: 'result',
    component: SimpleResultComponent
  },

  {
    path: 'about-us',
    component: AboutUsComponent
  },

  {
    path: 'imprint',
    component: ImprintComponent
  },

  {
    path: 'privacy',
    component: PrivacyPolicyComponent
  },

  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
