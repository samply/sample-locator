import {Component, Input, OnInit} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialQueryDto, EssentialSimpleFieldDto, SimpleValueOperator} from '../../model/query/essential-query-dto';

import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExtendedMdrFieldDto, MdrEntity} from '../../model/mdr/extended-mdr-field-dto';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-builder',
  templateUrl: './search-builder.component.html',
  styleUrls: ['./search-builder.component.scss']
})
export class SearchBuilderComponent implements OnInit {

  @Input()
  public mdrEntities: Array<MdrEntity>;

  @Input()
  public headerName: string;

  faPlus = faPlus;
  faMinus = faMinus;

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

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.createFormGroup(this.getQuery());
  }

  private createFormGroup(query: EssentialQueryDto): FormGroup {
    const fieldControls: FormArray = this.fb.array([]);

    for (const field of query.fields) {
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

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field.urn);
  }

  getPlaceholder(extendedField: ExtendedMdrFieldDto, operator: SimpleValueOperator) {
    if (extendedField && extendedField.placeHolder) {
      return extendedField.placeHolder;
    }

    return operator === SimpleValueOperator.BETWEEN ? 'Min.' : '';
  }

  filterFields(fields: Array<EssentialSimpleFieldDto>) {
    return fields.slice().filter(field =>
      this.mdrFieldProviderService.isFieldOfTypes(field, this.mdrEntities));
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
    values.push(this.fb.group({
        maxValue: this.fb.control(''),
        value: this.fb.control(''),
        operator: this.fb.control(SimpleValueOperator.EQUALS),
      })
    );
  }

  changeValue(i: number, j: number) {
    this.getQueryValue(i, j).value = this.getValueControl(i, j).value.value;
  }

  changeMaxValue(i: number, j: number) {
    this.getQueryValue(i, j).maxValue = this.getValueControl(i, j).value.maxValue;
  }

  private getQueryValue(i: number, j: number) {
    return this.getQueryField(i).values[j];
  }

  private getQuery() {
    return this.queryProviderService.query;
  }

  private getQueryField(i: number) {
    return this.getQuery().fields[i];
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
