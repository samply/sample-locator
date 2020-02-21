import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { SearchComponent } from './page/search/search.component';
import { SimpleResultComponent } from './page/simple-result/simple-result.component';
import { DetailedResultComponent } from './page/detailed-result/detailed-result.component';
import { AboutUsComponent } from './page/about-us/about-us.component';
import { ImprintComponent } from './page/imprint/imprint.component';
import { PrivacyPolicyComponent } from './page/privacy-policy/privacy-policy.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FlexLayoutModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(faTimes);
  }
}
