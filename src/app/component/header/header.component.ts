import {Component, OnInit} from '@angular/core';
import {ExternalUrlService} from '../../service/external-url.service';
import {UserService} from '../../service/user.service';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public externalUrlService: ExternalUrlService,
    public userService: UserService,
    public featureService: FeatureService) {
  }

  ngOnInit(): void {
  }

}
