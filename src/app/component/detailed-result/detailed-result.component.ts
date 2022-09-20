import {Component, Input, OnInit} from '@angular/core';
import {faHandshake,faFile} from '@fortawesome/free-regular-svg-icons';
import {Reply, ReplySite} from '../../model/result/reply-dto';
import {NegotiatorService} from '../../service/negotiator.service';
import {SlStorageService} from '../../service/sl-storage.service';
import {ResultComponent} from '../../page/result/result.component';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-detailed-result',
  templateUrl: './detailed-result.component.html',
  styleUrls: ['./detailed-result.component.scss']
})
export class DetailedResultComponent implements OnInit {

  faNegotiator = faHandshake;
  faFile = faFile;

  @Input()
  sumDonors = 0;

  @Input()
  sumSamples = 0;

  @Input()
  biobanksAnswered = 0;

  @Input()
  detailedResult: Reply = {replySites: []};

  negotiateFlags: Map<string, boolean> = new Map();

  constructor(
    private negotiatorService: NegotiatorService,
    private slStorageService: SlStorageService,
    public featureService: FeatureService
  ) {
  }

  selectedBiobanks: Array<string>;

  ngOnInit(): void {
    this.selectedBiobanks = this.slStorageService.getBiobankCollection();
    if (this.selectedBiobanks !== undefined && this.selectedBiobanks.length > 0) {
      this.selectedBiobanks?.forEach(biobank => {
        this.toggleNegotiateFlag(biobank);
      });
      // this.slStorageService.setBiobankCollection('');
    }
  }

  navigateToNegotiator() {
    if (!this.isAnyNegotiateFlagChecked()) {
      return;
    }

    const sites: Array<ReplySite> = [];
    for (const key of this.negotiateFlags.keys()) {
      if (this.negotiateFlags.get(key)) {
        const element = this.detailedResult.replySites.filter((x) => x.site === key);
        sites.push(element[0]);
      }
    }
    this.negotiatorService.redirectToNegotiator(sites);
  }

  getNegotiatorButtonClass() {
    return this.isAnyNegotiateFlagChecked() ? 'negotiate-button' : 'negotiate-button negotiate-button-inactive';
  }

  getNegotiateFlag(site: string): boolean {
    return this.negotiateFlags.has(site) && this.negotiateFlags.get(site);
  }

  toggleNegotiateFlag(site: string): void {
    if (this.negotiateFlags.has(site)) {
      this.negotiateFlags.set(site, !this.negotiateFlags.get(site));
    } else {
      this.negotiateFlags.set(site, true);
    }
  }

  private isAnyNegotiateFlagChecked() {
    for (const site of this.negotiateFlags.keys()) {
      if (this.negotiateFlags.get(site)) {
        return true;
      }
    }

    return false;
  }

  changePage() {
    if (ResultComponent.page === 0) {
      ResultComponent.page = 1;
    } else {
      ResultComponent.page = 0;
    }
  }
}
