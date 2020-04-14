import {Component, Input, OnInit} from '@angular/core';
import {faBuilding, faUser, faVial} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss']
})
export class SimpleResultComponent implements OnInit {

  faSample = faVial;
  faDonor = faUser;
  faBiobank = faBuilding;

  @Input()
  sumDonors = 0;

  @Input()
  sumSamples = 0;

  @Input()
  biobanksAnswered = 0;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

}
