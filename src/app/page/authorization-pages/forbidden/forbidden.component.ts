import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }
}
