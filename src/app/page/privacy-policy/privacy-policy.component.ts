import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

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

