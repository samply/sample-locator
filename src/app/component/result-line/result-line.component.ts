import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reply} from '../../model/result/reply-dto';
import {faUser, faVial} from '@fortawesome/free-solid-svg-icons';
import {faCheckSquare, faHandshake, faSquare} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-result-line',
  templateUrl: './result-line.component.html',
  styleUrls: ['./result-line.component.scss']
})
export class ResultLineComponent implements OnInit {

  faSample = faVial;
  faDonor = faUser;
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;
  faNegotiator = faHandshake;

  @Input()
  reply: Reply = {replySites: []};

  @Input()
  negFlag = false;

  @Output()
  toggleNegFlag = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  toggleNegotiateFlag() {
    this.negFlag = !this.negFlag;
    this.toggleNegFlag.emit(this.negFlag);
  }

  getNegotiateIcon(): any {
    return this.negFlag ? this.faCheckSquare : this.faSquare;
  }
}
