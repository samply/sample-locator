import {Inject, Injectable} from '@angular/core';
import {ExtendedMdrFieldDto, MdrEntity} from '../model/mdr/extended-mdr-field-dto';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {EssentialQueryDto} from '../model/query/essential-query-dto';
import {SampleLocatorConstants} from '../SampleLocatorConstants';

type AppTargetRoute = 'search' | 'result';
type AppAction = 'sendQuery' | 'login' | 'logoff' | 'unspecified';

@Injectable({
  providedIn: 'root'
})
export class SlStorageService {

  private static STORAGE_KEY_APP_TARGET_ROUTE = 'app-target';
  private static STORAGE_KEY_APP_ACTION = 'app-action';

  private static STORAGE_KEY_QUERY = 'query';
  private static STORAGE_KEY_N_TOKEN = 'nToken';

  private static STORAGE_KEY_MDR_ALL_DATA_ELEMENTS = 'mdr-all-data-elements';
  private static STORAGE_KEY_MDR_DATA_ELEMENT_GROUP_MEMBERS_MAP = 'mdr-data-element-group-members-map';
  private static STORAGE_KEY_MDR_ENTITY_URNS_MAP = 'mdr-entity-urns-map';

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  getAppTargetRoute(): AppTargetRoute {
    const target = this.storage.get(SlStorageService.STORAGE_KEY_APP_TARGET_ROUTE);

    return target ? target : SampleLocatorConstants.ROUTE_SEARCH;
  }

  getAppAction(): AppAction {
    const action = this.storage.get(SlStorageService.STORAGE_KEY_APP_ACTION);

    return action ? action : 'unspecified';
  }

  setAppTargetRoute(target: AppTargetRoute): void {
    this.storage.set(SlStorageService.STORAGE_KEY_APP_TARGET_ROUTE, target);
  }

  setAppAction(action: AppAction): void {
    this.storage.set(SlStorageService.STORAGE_KEY_APP_ACTION, action);
  }

  resetAppAction() {
    this.setAppAction('unspecified');
  }

  getQuery(): EssentialQueryDto {
    return this.storage.get(SlStorageService.STORAGE_KEY_QUERY);
  }

  setQuery(query: EssentialQueryDto): void {
    this.storage.set(SlStorageService.STORAGE_KEY_QUERY, query);
  }

  getNToken(): string {
    return this.storage.get(SlStorageService.STORAGE_KEY_N_TOKEN);
  }

  setNToken(nToken: string): void {
    const nTokenTemp = (nToken && nToken !== 'undefined' && nToken !== 'null') ? nToken : '';

    this.storage.set(SlStorageService.STORAGE_KEY_N_TOKEN, nTokenTemp);
  }

  getAllDataElments(): Array<ExtendedMdrFieldDto> {
    return this.storage.get(SlStorageService.STORAGE_KEY_MDR_ALL_DATA_ELEMENTS) ?
      this.storage.get(SlStorageService.STORAGE_KEY_MDR_ALL_DATA_ELEMENTS) : [];
  }

  setAllDataElments(allDataElements: Array<ExtendedMdrFieldDto>): void {
    this.storage.set(SlStorageService.STORAGE_KEY_MDR_ALL_DATA_ELEMENTS, allDataElements);
  }

  getDataElementGroupMembersMap(): Map<MdrEntity, Array<ExtendedMdrFieldDto>> {
    // cannot store a Map directly
    const mapAsArray: IterableIterator<[MdrEntity, Array<ExtendedMdrFieldDto>]> =
      this.storage.get(SlStorageService.STORAGE_KEY_MDR_DATA_ELEMENT_GROUP_MEMBERS_MAP);

    if (!mapAsArray) {
      return new Map();
    }

    return new Map(mapAsArray);
  }

  setDataElementGroupMembersMap(dataElementGroupMembersMap: Map<MdrEntity, Array<ExtendedMdrFieldDto>>): void {
    const mapAsArray = Array.from(dataElementGroupMembersMap.entries());

    this.storage.set(SlStorageService.STORAGE_KEY_MDR_DATA_ELEMENT_GROUP_MEMBERS_MAP, mapAsArray);
  }

  getEntityUrnsMap(): Map<MdrEntity, Array<string>> {
    // cannot store a Map directly
    const mapAsArray: IterableIterator<[MdrEntity, Array<string>]> =
      this.storage.get(SlStorageService.STORAGE_KEY_MDR_ENTITY_URNS_MAP);

    if (!mapAsArray) {
      return new Map();
    }

    return new Map(mapAsArray);
  }

  setEntityUrnsMap(entityUrnsMap: Map<MdrEntity, Array<string>>): void {
    const mapAsArray = Array.from(entityUrnsMap.entries());

    this.storage.set(SlStorageService.STORAGE_KEY_MDR_ENTITY_URNS_MAP, mapAsArray);
  }
}
