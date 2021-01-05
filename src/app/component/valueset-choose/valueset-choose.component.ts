import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ValueSetChooseService} from '../../service/valueset-choose.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-valueset-choose',
  templateUrl: './valueset-choose.component.html',
  styleUrls: ['./valueset-choose.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueSetChooseComponent),
      multi: true
    }
  ]
})
export class ValueSetChooseComponent implements ControlValueAccessor {

  @Input()
  valueSetUrl = '';

  @Input()
  placeholderText: '';

  @Output()
  selectOption = new EventEmitter();

  value = '';

  codesFilteredMap: Map<string, string> = new Map();
  codesFiltered = [];

  subscriptionFilter: Subscription;

  // noinspection JSUnusedLocalSymbols
  onChange = ((arg: any) => {
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

  constructor(private chooseService: ValueSetChooseService) {
  }

  filterCodes($event) {
    if (this.subscriptionFilter) {
      this.subscriptionFilter.unsubscribe();
    }

    this.subscriptionFilter = this.chooseService.getSuggestionsObservable(this.valueSetUrl, $event.query.toLowerCase()).subscribe(
      dto => {
        if (dto.expansion.contains) {
          const codesFilteredMapTemp: Map<string, string> = new Map();
          const codesFilteredTemp: Array<string> = [];

          dto.expansion.contains.forEach(entry => {
            codesFilteredTemp.push(entry.code);
            codesFilteredMapTemp.set(entry.code, entry.display);
          });

          this.codesFiltered = codesFilteredTemp;
          this.codesFilteredMap = codesFilteredMapTemp;
        } else {
          this.codesFiltered = [];
          this.codesFilteredMap = new Map();
        }
      }
    );
  }

  doSelectOption(option) {
    this.value = option;
    this.selectOption.emit(option);
  }
}
