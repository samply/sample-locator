import {Component, Input, OnInit} from '@angular/core';
import {faHandshake} from '@fortawesome/free-regular-svg-icons';
import {ReplySiteDto} from '../../model/result/reply-dto';
import {NegotiatorService} from '../../service/negotiator.service';

@Component({
  selector: 'app-detailed-result',
  templateUrl: './detailed-result.component.html',
  styleUrls: ['./detailed-result.component.scss']
})
export class DetailedResultComponent implements OnInit {

  faNegotiator = faHandshake;

  @Input()
  sumDonors = 0;

  @Input()
  sumSamples = 0;

  @Input()
  biobanksAnswered = 0;

  @Input()
  detailedResult: Array<ReplySiteDto> = [];

  negotiateFlags: Map<string, boolean> = new Map();

  constructor(
    private negotiatorService: NegotiatorService
  ) {
  }

  ngOnInit(): void {
  }

  navigateToNegotiator() {
    if (!this.isAnyNegotiateFlagChecked()) {
      return;
    }

    const sites: Array<string> = [];
    for (const key of this.negotiateFlags.keys()) {
      if (this.negotiateFlags.get(key)) {
        sites.push(key);
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
}
