import {Component, OnInit} from '@angular/core';
import {VersionService} from '../../service/version.service';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public versionService: VersionService, public featureService: FeatureService) {
  }

  ngOnInit(): void {
  }

}
