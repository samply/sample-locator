import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-samply-button',
  templateUrl: './samply-button.component.html',
  styleUrls: ['./samply-button.component.scss']
})
export class SamplyButtonComponent {

  @Input()
  active = true;

  @Input()
  visible = true;

  @Input()
  label = '';

  @Input()
  imageIcon: any;
}
