import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MdrConfigService} from './mdr-config.service';
import {ExtendedMdrFieldDto, MdrEntity} from '../model/mdr/extended-mdr-field-dto';
import {EssentialSimpleFieldDto} from '../model/query/essential-query-dto';
import {BehaviorSubject, Subject} from 'rxjs';
import {SlStorageService} from './sl-storage.service';
import {MdrFieldProviderServiceRefresher} from './mdr-field-provider-service-refresher';

@Injectable({
  providedIn: 'root'
})
export class MdrFieldProviderService {

  public ready$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private mdrConfigService: MdrConfigService,
    private slStorageService: SlStorageService
  ) {
    // We use the existing data from MDR if it is already saved in local storage.
    if (this.slStorageService.getDataElementGroupMembersMap().size > 0
      && this.slStorageService.getEntityUrnsMap().size > 0
      && this.slStorageService.getAllDataElments().length > 0) {
      this.ready$.next(true);
    }
    // However, in background we renew the data and save it in the local storage
    // for the next routing/session (e.g. after login)
    new MdrFieldProviderServiceRefresher(httpClient, mdrConfigService, slStorageService, this.ready$).refreshMdrData();
  }

  public getAllPossibleFields(mdrEntites?: Array<MdrEntity>): Array<ExtendedMdrFieldDto> {
    if (!mdrEntites) {
      return this.slStorageService.getAllDataElments();
    } else {
      const result: Array<ExtendedMdrFieldDto> = [];
      mdrEntites.forEach(mdrEntity => {
        this.slStorageService.getAllDataElments().forEach(extendedField => {
          if (!!this.slStorageService.getEntityUrnsMap().get(mdrEntity).find(urn => urn === extendedField.urn)) {
            result.push(extendedField);
          }
        });
      });

      return result;
    }
  }

  public getPossibleField(urn: string): ExtendedMdrFieldDto | null {
    return this.slStorageService.getAllDataElments().find(field => field.urn === urn);
  }

  public getPossibleFields(mdrEntity: MdrEntity) {
    if (this.slStorageService.getDataElementGroupMembersMap().has(mdrEntity)) {
      return this.slStorageService.getDataElementGroupMembersMap().get(mdrEntity);
    } else {
      return [];
    }
  }

  public isFieldOfTypes(field: EssentialSimpleFieldDto, mdrEntities: Array<MdrEntity>): boolean {
    for (const mdrEntity of mdrEntities) {
      if (!!this.slStorageService.getEntityUrnsMap().get(mdrEntity).find(urn => urn === field['@'].urn)) {
        return true;
      }
    }

    return false;
  }
}
