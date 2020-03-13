import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SlStorageService} from '../../../service/sl-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  constructor(
    private router: Router,
    private slStorageService: SlStorageService
  ) {
  }

  ngOnInit(): void {
    const route = '/' + this.slStorageService.getAppTargetRoute();

    this.slStorageService.resetAppAction();
    this.router.navigate([route]);
  }

}
