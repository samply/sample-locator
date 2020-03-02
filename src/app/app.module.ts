import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page/page-not-found/page-not-found.component';
import {SearchComponent} from './page/search/search.component';
import {SimpleResultComponent} from './page/simple-result/simple-result.component';
import {DetailedResultComponent} from './page/detailed-result/detailed-result.component';
import {AboutUsComponent} from './page/about-us/about-us.component';
import {ImprintComponent} from './page/imprint/imprint.component';
import {PrivacyPolicyComponent} from './page/privacy-policy/privacy-policy.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {HeaderComponent} from './component/header/header.component';
import {FooterComponent} from './component/footer/footer.component';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {WorkInProgressComponent} from './component/work-in-progress/work-in-progress.component';
import {CookieBannerComponent} from './component/cookie-banner/cookie-banner.component';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {ExternalUrlService} from './service/external-url.service';
import {MdrConfigService} from './service/mdr-config.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {ProgressBarModule} from 'primeng/progressbar';
import {SearchBuilderComponent} from './component/search-builder/search-builder.component';


export function initializerExternalUrlService(
  externalUrlService: ExternalUrlService,
) {
  return () => {
    // noinspection JSUnusedLocalSymbols
    return externalUrlService.load();
  };
}

export function initializerMdrConfigService(
  mdrConfigService: MdrConfigService,
) {
  return () => {
    return mdrConfigService.load();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SearchComponent,
    SimpleResultComponent,
    DetailedResultComponent,
    AboutUsComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    HeaderComponent,
    FooterComponent,
    WorkInProgressComponent,
    CookieBannerComponent,
    SearchBuilderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,

    InputTextModule,
    CalendarModule,
    DropdownModule,
    ProgressBarModule,
  ],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ExternalUrlService],
      useFactory: initializerExternalUrlService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [MdrConfigService],
      useFactory: initializerMdrConfigService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faTimes);
  }
}
