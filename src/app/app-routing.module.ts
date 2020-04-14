import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page/page-not-found/page-not-found.component';
import {SearchComponent} from './page/search/search.component';
import {ResultComponent} from './page/result/result.component';
import {AboutUsComponent} from './page/about-us/about-us.component';
import {ImprintComponent} from './page/imprint/imprint.component';
import {PrivacyPolicyComponent} from './page/privacy-policy/privacy-policy.component';
import {ForbiddenComponent} from './page/authorization-pages/forbidden/forbidden.component';
import {LoggedInComponent} from './page/authorization-pages/logged-in/logged-in.component';
import {UnauthorizedComponent} from './page/authorization-pages/unauthorized/unauthorized.component';
import {SampleLocatorConstants} from './SampleLocatorConstants';
import {RestoreComponent} from './page/restore/restore.component';

const routes: Routes = [
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: 'authorized',
    component: LoggedInComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },




  {
    path: '',
    pathMatch: 'full',
    redirectTo: SampleLocatorConstants.ROUTE_SEARCH
  },

  {
    path: SampleLocatorConstants.ROUTE_SEARCH,
    component: SearchComponent
  },

  {
    path: SampleLocatorConstants.ROUTE_RESULT,
    component: ResultComponent
  },

  {
    path: SampleLocatorConstants.ROUTE_RESTORE,
    component: RestoreComponent
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
  imports: [RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
