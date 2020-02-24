import {Component, OnInit} from '@angular/core';
import {InfoVersionService} from '../../service/info-version.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public infoVersionService: InfoVersionService) {
  }

  ngOnInit(): void {
  }

}
