import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExternalUrlService} from '../../service/external-url.service';
import {UserBeanService} from '../../service/user-bean.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  brokerUrl = '';
  private subscriptionExternalUrlService: Subscription;

  constructor(
    public externalUrlService: ExternalUrlService,
    public userService: UserBeanService) {
  }

  ngOnInit(): void {
    this.subscriptionExternalUrlService = this.externalUrlService.getBrokerUrl().subscribe(value => this.brokerUrl = value);
  }

  ngOnDestroy(): void {
    if (this.subscriptionExternalUrlService) {
      this.subscriptionExternalUrlService.unsubscribe();
    }
  }

}
