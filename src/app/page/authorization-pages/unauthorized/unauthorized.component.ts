import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }
}

