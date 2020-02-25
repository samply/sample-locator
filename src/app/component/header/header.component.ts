import {Component, OnInit} from '@angular/core';
import {ExternalUrlService} from '../../service/external-url.service';
import {UserBeanService} from '../../service/user-bean.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public externalUrlService: ExternalUrlService,
    public userService: UserBeanService) {
  }

  ngOnInit(): void {
  }

}
