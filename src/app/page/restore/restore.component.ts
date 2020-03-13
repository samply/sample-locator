import * as converter from 'xml-js';

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {QueryProviderService} from '../../service/query-provider.service';
import {ExternalUrlService} from '../../service/external-url.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {EssentialQueryDto} from '../../model/query/essential-query-dto';
import {SampleLocatorConstants} from '../../SampleLocatorConstants';

// removes the _text attribute that xml-js adds by default
const removeJsonTextAttribute = (value, parentElement) => {
  try {
    const pOpKeys = Object.keys(parentElement._parent);
    const keyNo = pOpKeys.length;
    const keyName = pOpKeys[keyNo - 1];
    const arrOfKey = parentElement._parent[keyName];
    const arrOfKeyLen = arrOfKey.length;
    if (arrOfKeyLen > 0) {
      const arr = arrOfKey;
      const arrIndex = arrOfKey.length - 1;
      arr[arrIndex] = value;
    } else {
      parentElement._parent[keyName] = value;
    }
  } catch (e) {
  }
};

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];
  nToken: string;

  constructor(
    public queryProviderService: QueryProviderService,
    private externalUrlService: ExternalUrlService,
    private slStorageService: SlStorageService,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initParameters();
  }

  private initParameters() {
    this.subscriptions.push(this.route.queryParams.subscribe(parms => {
      this.nToken = parms.ntoken;
      this.slStorageService.setNToken(this.nToken);

      if (!this.nToken) {
        this.queryProviderService.restoreQuery();
        this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
        return;
      }

      this.initQuery();
    }));
  }

  private initQuery() {
    let queryRestored = {
      fieldDtos: []
    };

    const url = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/getQuery?ntoken=' + this.nToken;
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    this.subscriptions.push(
      this.httpClient.get(url, {
        responseType: 'text',
        headers
      }).subscribe(
        query => {
          const result: any = converter.xml2js(query, {
            compact: true,
            attributesKey: '@',
            ignoreDeclaration: true,
            nativeType: true,
            alwaysArray: true,
            alwaysChildren: true,
            textFn: removeJsonTextAttribute
          });

          const queryArrayTemp = (result[Object.keys(result)[0]]) as Array<EssentialQueryDto>;

          if (queryArrayTemp && queryArrayTemp.length > 0) {
            queryRestored = queryArrayTemp[0];
            this.fixEmptyTags(queryRestored);
          }

          this.slStorageService.setQuery(queryRestored);

          this.router.navigate([SampleLocatorConstants.ROUTE_SEARCH]);
        }
      )
    );
  }

  // noinspection JSMethodCanBeStatic
  private fixEmptyTags(queryTemp: EssentialQueryDto) {
    if (!queryTemp || !queryTemp.fieldDtos) {
      return;
    }

    for (const field of queryTemp.fieldDtos) {
      if (!field || !field.valueDtos) {
        continue;
      }

      for (const value of field.valueDtos) {
        // Empty tags are converted to some dummy object
        if (typeof value.value === 'object') {
          value.value = '';
        }
        if (typeof value.maxValue === 'object') {
          value.maxValue = '';
        }
      }
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
