import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  faTimes = faTimes;

  constructor() { }

  ngOnInit(): void {
  }

  // TODO: Check if following error is relevant:
  // Scripts may close only the windows that were opened by it.
  close() {
    window.top.close();
  }
}
