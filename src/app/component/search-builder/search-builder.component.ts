import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto, EssentialValueType, SimpleValueOperator} from '../../model/query/essential-query-dto';

import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExtendedMdrFieldDto, MdrDataType, MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';

import * as moment from 'moment';

@Component({
  selector: 'app-search-builder',
  templateUrl: './search-builder.component.html',
  styleUrls: ['./search-builder.component.scss']
})
export class SearchBuilderComponent implements OnInit, OnDestroy {

  @Input()
  public mdrEntities: Array<MdrEntity>;

  @Input()
  public headerName: string;

  faPlus = faPlus;
  faMinus = faMinus;

  filteredFields: Array<EssentialSimpleFieldDto> = [];

  public formGroup: FormGroup = new FormGroup({dummy: new FormControl('')});

  operators = [
    {
      label: '=',
      value: SimpleValueOperator.EQUALS
    },
    {
      label: '<>',
      value: SimpleValueOperator.NOT_EQUALS
    },
    {
      label: '<',
      value: SimpleValueOperator.LESS
    },
    {
      label: '<=',
      value: SimpleValueOperator.LESS_OR_EQUALS
    },
    {
      label: '>',
      value: SimpleValueOperator.GREATER
    },
    {
      label: '>=',
      value: SimpleValueOperator.GREATER_OR_EQUALS
    },
    {
      label: '...',
      value: SimpleValueOperator.BETWEEN
    }
  ];

  private readonly subscriptionReady: Subscription;

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private fb: FormBuilder
  ) {
    this.subscriptionReady = this.mdrFieldProviderService.ready$.subscribe(value => {
      if (value) {
        this.filteredFields =
          this.getQuery().fields.slice().filter(field =>
            this.mdrFieldProviderService.isFieldOfTypes(field, this.mdrEntities));

        this.formGroup = this.createFormGroup();
      }
    });
  }

  private createFormGroup(): FormGroup {
    const fieldControls: FormArray = this.fb.array([]);

    for (const field of this.filteredFields) {
      const valueControls: FormArray = this.fb.array([]);

      for (const value of field.values) {
        const valueGroup = this.fb.group({
          value: this.fb.control(value.value),
          maxValue: this.fb.control(value.maxValue),
          operator: this.fb.control(value.operator.toString()),
        });

        valueControls.push(valueGroup);
      }

      const fieldGroup = this.fb.group({
        urn: this.fb.control(field.urn),
        valueType: this.fb.control(field.valueType.toString()),
        values: valueControls
      });

      fieldControls.push(fieldGroup);
    }

    return this.fb.group({
      fields: fieldControls
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscriptionReady) {
      this.subscriptionReady.unsubscribe();
    }
  }

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field.urn);
  }

  getPlaceholder(extendedField: ExtendedMdrFieldDto, operator: SimpleValueOperator) {
    if (extendedField && extendedField.placeHolder) {
      return extendedField.placeHolder;
    }

    if (extendedField.mdrDataType === MdrDataType.ENUMERATED) {
      return 'Select';
    }

    return operator === SimpleValueOperator.BETWEEN ? 'Min.' : '';
  }

  chooseOperator($event: any, i: number, j: number) {
    this.getQueryValue(i, j).operator = $event.value;
  }

  deleteValue(i: number, j: number) {
    this.getQueryField(i).values.splice(j, 1);
    const values: FormArray = this.getValuesFormArray(i);
    values.removeAt(j);

    if (this.getQueryField(i).values.length === 0) {
      this.getQuery().fields.splice(i, 1);
      this.getFieldsFormArray().removeAt(i);
    }
  }

  addValue(i: number) {
    const fieldDto = this.getQueryField(i);

    this.queryProviderService.addEmptyValue(fieldDto);
    const values: FormArray = this.getValuesFormArray(i);
    const value = (fieldDto.valueType === EssentialValueType.DATE || fieldDto.valueType === EssentialValueType.DATETIME)
      ? this.fb.control(new Date()) : this.fb.control('');

    values.push(this.fb.group({
        maxValue: this.fb.control(''),
        value,
        operator: this.fb.control(SimpleValueOperator.EQUALS),
      })
    );
  }

  changeValue(i: number, j: number) {
    const valueType = this.getQueryField(i).valueType;
    const newValue = this.getValueControl(i, j).value.value;

    this.getQueryValue(i, j).value = this.adoptDateFormat(newValue, valueType);
  }

  changeMaxValue(i: number, j: number) {
    const valueType = this.getQueryField(i).valueType;
    const newValue = this.getValueControl(i, j).value.maxValue;

    this.getQueryValue(i, j).maxValue = this.adoptDateFormat(newValue, valueType);
  }

  // noinspection JSMethodCanBeStatic
  private adoptDateFormat(newValue, valueType: EssentialValueType) {
    if (newValue && valueType === EssentialValueType.DATE) {
      newValue = moment(newValue).format('DD.MM.YYYY');
      console.log(newValue);
    } else if (newValue && valueType === EssentialValueType.DATETIME) {
      newValue = moment(newValue).format('DD.MM.YYYY\'T\'HH:mm:ss');
      console.log(newValue);
    }

    return newValue;
  }

  private getQueryValue(i: number, j: number) {
    return this.getQueryField(i).values[j];
  }

  private getQuery() {
    return this.queryProviderService.query;
  }

  private getQueryField(i: number) {
    return this.filteredFields[i];
  }

  private getValueControl(i: number, j: number) {
    return this.getValuesFormArray(i).get(j.toString());
  }

  private getValuesFormArray(i: number) {
    return (this.getFieldControl(i).get('values')) as FormArray;
  }

  private getFieldControl(i: number) {
    return this.getFieldsFormArray().get(i.toString());
  }

  private getFieldsFormArray(): FormArray {
    return this.formGroup.get('fields') as FormArray;
  }
}
