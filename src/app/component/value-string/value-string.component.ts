import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-value-string',
  templateUrl: './value-string.component.html',
  styleUrls: ['./value-string.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueStringComponent),
      multi: true
    }
  ]
})
export class ValueStringComponent implements ControlValueAccessor {

  @Input()
  placeholderText: '';

  value = '';
  onChange = (() => {
  });
  onTouched = (() => {
  });

  disabled = false;

  writeValue(value: string): void {
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
