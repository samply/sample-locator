import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-value-number',
  templateUrl: './value-number.component.html',
  styleUrls: ['./value-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueNumberComponent),
      multi: true
    }
  ]
})
export class ValueNumberComponent implements ControlValueAccessor {

  @Input()
  placeholderText: '';

  value: number;
  onChange = (() => {
  });
  onTouched = (() => {
  });

  disabled = false;

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
