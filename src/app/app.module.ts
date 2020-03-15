import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page/page-not-found/page-not-found.component';
import {SearchComponent} from './page/search/search.component';
import {ResultComponent} from './page/result/result.component';
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
import {TableModule} from 'primeng/table';
import {SearchBuilderComponent} from './component/search-builder/search-builder.component';
import {AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration} from 'angular-auth-oidc-client';
import {LoggedInComponent} from './page/authorization-pages/logged-in/logged-in.component';
import {ForbiddenComponent} from './page/authorization-pages/forbidden/forbidden.component';
import {UnauthorizedComponent} from './page/authorization-pages/unauthorized/unauthorized.component';
import {RestoreComponent} from './page/restore/restore.component';
import {TooltipModule} from 'primeng';
import {MolgenisService} from './service/molgenis.service';

// TODO: (1)   "disable_iat_offset_validation": false setzen

// tslint:disable-next-line:variable-name
const oidc_configuration = '/assets/config/auth.clientConfiguration.json';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}

export function initializerExternalUrlService(
  externalUrlService: ExternalUrlService,
) {
  return () => {
    // noinspection JSUnusedLocalSymbols
    return externalUrlService.load();
  };
}

export function initializerMolgenisService(
  molgenisService: MolgenisService,
) {
  return () => {
    // noinspection JSUnusedLocalSymbols
    return molgenisService.load();
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
    ResultComponent,
    AboutUsComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    HeaderComponent,
    FooterComponent,
    WorkInProgressComponent,
    CookieBannerComponent,
    SearchBuilderComponent,
    LoggedInComponent,
    ForbiddenComponent,
    UnauthorizedComponent,
    RestoreComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot(),

    HttpClientModule,
    FlexLayoutModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,

    InputTextModule,
    CalendarModule,
    DropdownModule,
    ProgressBarModule,
    TableModule,
    TooltipModule,
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
      deps: [MolgenisService],
      useFactory: initializerMolgenisService
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [MdrConfigService],
      useFactory: initializerMdrConfigService
    },
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    library.add(faTimes);

    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

      // Use the configResult to set the configurations
      const customConfig: OpenIdConfiguration = configResult.customConfig;

      const config: OpenIdConfiguration = {
        stsServer: customConfig.stsServer,
        redirect_url: customConfig.redirect_url,
        client_id: customConfig.client_id,
        response_type: customConfig.response_type,
        scope: customConfig.scope,
        start_checksession: customConfig.start_checksession,
        silent_renew: customConfig.silent_renew,
        silent_renew_url: customConfig.silent_renew_url,
        post_login_route: customConfig.post_login_route,
        unauthorized_route: customConfig.unauthorized_route,
        forbidden_route: customConfig.forbidden_route,
        log_console_debug_active: customConfig.log_console_debug_active,
        log_console_warning_active: customConfig.log_console_warning_active,
        disable_iat_offset_validation: customConfig.disable_iat_offset_validation,
        max_id_token_iat_offset_allowed_in_seconds: customConfig.max_id_token_iat_offset_allowed_in_seconds,
      };

      this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
  }
}
