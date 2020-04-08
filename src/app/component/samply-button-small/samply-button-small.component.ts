import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-samply-button-small',
  templateUrl: './samply-button-small.component.html',
  styleUrls: ['./samply-button-small.component.scss']
})
export class SamplyButtonSmallComponent {

  @Input()
  active = true;

  @Input()
  imageIcon: any;
}
