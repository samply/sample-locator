import * as moment from 'moment';

import {Component, EventEmitter, Input, Output, OnDestroy, OnInit} from '@angular/core';
import {MdrFieldProviderService} from '../../service/mdr-field-provider.service';
import {QueryProviderService} from '../../service/query-provider.service';
import {EssentialSimpleFieldDto, EssentialValueType, SimpleValueOperator} from '../../model/query/essential-query-dto';

import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExtendedMdrFieldDto, MdrDataType, MdrEntity, PermittedValue} from '../../model/mdr/extended-mdr-field-dto';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';

import {SlStorageService} from '../../service/sl-storage.service';

import {faCheckSquare, faHandshake, faSquare} from '@fortawesome/free-regular-svg-icons';

class AddibleField {
  label: string;
  value: string;
}

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

  @Input()
  disabled = false;

  private addField: FormControl;

  faMinus = faMinus;
  faPlus = faPlus;

  filteredFields: Array<EssentialSimpleFieldDto>;
  addibleFields: Array<AddibleField>;
  permittedValuesMap: Map<EssentialSimpleFieldDto, Array<PermittedValue>>;

  public formGroup: FormGroup = new FormGroup({dummy: new FormControl('')});

  operators = [
    {
      label: '=',
      value: SimpleValueOperator.EQUALS
    },
    {
      label: '≠',
      value: SimpleValueOperator.NOT_EQUALS
    },
    {
      label: '<',
      value: SimpleValueOperator.LESS
    },
    {
      label: '≤',
      value: SimpleValueOperator.LESS_OR_EQUALS
    },
    {
      label: '>',
      value: SimpleValueOperator.GREATER
    },
    {
      label: '≥',
      value: SimpleValueOperator.GREATER_OR_EQUALS
    },
    {
      label: '...',
      value: SimpleValueOperator.BETWEEN
    }
  ];

  operatorsEqualsOnly = [
    {
      label: '=',
      value: SimpleValueOperator.EQUALS
    }
  ];

  operatorsEqualsAndNotEquals = [
    {
      label: '=',
      value: SimpleValueOperator.EQUALS
    },
    {
      label: '≠',
      value: SimpleValueOperator.NOT_EQUALS
    }
  ];

  private subscriptionReady: Subscription;

  constructor(
    public mdrFieldProviderService: MdrFieldProviderService,
    public queryProviderService: QueryProviderService,
    private slStorageService: SlStorageService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.subscriptionReady = this.mdrFieldProviderService.ready$.subscribe(value => {
      if (value) {
        this.calculateFilteredFields();
        this.initAddibleFields();
      }
    });
  }

  public calculateFilteredFields() {
    this.filteredFields =
      this.getQuery().fieldDtos.slice().filter(field =>
        this.mdrFieldProviderService.isFieldOfTypes(field, this.mdrEntities));
    this.formGroup = this.createFormGroup();
    this.initPermittedValuesMap();
  }

  private initPermittedValuesMap() {
    this.permittedValuesMap = new Map();
    for (const field of this.filteredFields) {
      this.permittedValuesMap.set(field, this.getExtendedMdrField(field).permittedValues);
    }
  }

  private createFormGroup(): FormGroup {
    const fieldControls: FormArray = this.fb.array([]);

    for (const field of this.filteredFields) {
      const valueControls: FormArray = this.fb.array([]);

      for (const value of field.valueDtos) {
        const valueGroup = this.fb.group({
          value: this.fb.control(value.value),
          maxValue: this.fb.control(value.maxValue),
          operator: this.fb.control(value.condition.toString()),
        });

        if (!this.isOperatorSelectable(field)) {
          valueGroup.get('operator').disable();
        }

        valueControls.push(valueGroup);
      }

      const fieldGroup = this.fb.group({
        urn: this.fb.control(field.urn),
        valueType: this.fb.control(field.valueType.toString()),
        values: valueControls,
      });

      fieldControls.push(fieldGroup);
    }

    this.addField = this.fb.control('');
    const formGroup = this.fb.group({
      addField: this.addField,
      fields: fieldControls
    });

    if (this.disabled) {
      formGroup.disable();
    }

    return formGroup;
  }

  isOperatorSelectable(field) {
    return this.getPossibleOperators(field.valueType).length > 1;
  }

  private initAddibleFields() {
    this.addibleFields = [];

    this.mdrFieldProviderService.getAllPossibleFields(this.mdrEntities).slice().forEach(field => {
      const addibleField = {
        label: field.name,
        value: field.urn
      };

      this.addibleFields.push(addibleField);
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionReady) {
      this.subscriptionReady.unsubscribe();
    }
  }

  getExtendedMdrField(field: EssentialSimpleFieldDto): ExtendedMdrFieldDto | null {
    return this.mdrFieldProviderService.getPossibleField(field.urn);
  }

  // noinspection JSMethodCanBeStatic
  getPlaceholder(extendedField: ExtendedMdrFieldDto, operator: SimpleValueOperator) {
    if (extendedField && extendedField.placeHolder) {
      return extendedField.placeHolder;
    }

    if (extendedField.mdrDataType === MdrDataType.ENUMERATED) {
      return 'Select';
    }

    return operator === SimpleValueOperator.BETWEEN ? 'Min.' : '';
  }

  getPossibleOperators(valueType: EssentialValueType) {
    if (valueType === EssentialValueType.PERMITTEDVALUE) {
      return this.operatorsEqualsOnly;
    } else if (valueType === EssentialValueType.STRING) {
      return this.operatorsEqualsAndNotEquals;
    } else {
      return this.operators;
    }
  }

  chooseOperator($event: any, i: number, j: number) {
    console.log("chooseOperator: i,j: ", i, j);
    this.getQueryValue(i, j).condition = $event.value;
    this.slStorageService.setQuery(this.getQuery());
  }

  deleteValue(i: number, j: number) {
    if (this.disabled) {
      return;
    }

    this.getQueryField(i).valueDtos.splice(j, 1);
    const values: FormArray = this.getValuesFormArray(i);
    values.removeAt(j);

    if (this.getQueryField(i).valueDtos.length === 0) {
      const index = this.getQuery().fieldDtos.findIndex(field => field.valueDtos.length === 0);
      // There can only be one field without values

      this.getQuery().fieldDtos.splice(index, 1);

      this.filteredFields.splice(i, 1);
      this.getFieldsFormArray().removeAt(i);
    }

    this.slStorageService.setQuery(this.getQuery());
  }

  addValue(i: number) {
    console.log("addValue: i: ", i)
    if (this.disabled) {
      return;
    }

    const fieldDto = this.getQueryField(i);

    console.log("addValue: hmm...")
    console.log("addValue: queryProviderService: ", this.queryProviderService)
    console.log("addValue: add empty")
    this.queryProviderService.addEmptyValue(fieldDto);
    console.log("addValue: get values")
    const values: FormArray = this.getValuesFormArray(i);
    console.log("addValue: extract value")
    const value = (fieldDto.valueType === EssentialValueType.DATE || fieldDto.valueType === EssentialValueType.DATETIME)
      ? this.fb.control(null) : this.fb.control('');
    console.log("addValue: BEFORE setting value, values length: ", values.length);
    console.log("addValue: value: ", value)

    console.log("addValue: push")
    values.push(this.fb.group({
        maxValue: this.fb.control(''),
        value,
        operator: this.fb.control(SimpleValueOperator.EQUALS),
      })
    );
    console.log("addValue: AFTER setting value, values length: ", values.length);

    this.slStorageService.setQuery(this.getQuery());
  }

  changeValue(i: number, j: number) {
    console.log("changeValue: i,j: ", i, j);
    const valueType = this.getQueryField(i).valueType;
    const newValue = this.getValueControl(i, j).value.value;

    console.log("changeValue: valueType: ", valueType);
    console.log("changeValue: newValue: ", newValue);
    this.getQueryValue(i, j).value = this.adoptDateFormat(newValue, valueType);

    console.log("changeValue: getQueryValue: ", this.getQueryValue(i, j).value);

    if (newValue
      && this.getQueryField(i).valueDtos.length <= j + 1
      && this.getQueryValue(i, j).condition !== SimpleValueOperator.BETWEEN) {
      this.addValue(i);
      console.log("changeValue: Added new value")
    }

    console.log("changeValue: getQuery: ", this.getQuery());
    this.slStorageService.setQuery(this.getQuery());
    console.log("changeValue: DONE");
  }

  changeMaxValue(i: number, j: number) {
    const valueType = this.getQueryField(i).valueType;
    const newValue = this.getValueControl(i, j).value.maxValue;

    this.getQueryValue(i, j).maxValue = this.adoptDateFormat(newValue, valueType);

    if (newValue && this.getQueryField(i).valueDtos.length <= j + 1) {
      this.addValue(i);
    }

    this.slStorageService.setQuery(this.getQuery());
  }

  // noinspection JSMethodCanBeStatic
  private adoptDateFormat(newValue, valueType: EssentialValueType) {
    if (newValue && valueType === EssentialValueType.DATE) {
      newValue = moment(newValue).format('DD.MM.YYYY');
    } else if (newValue && valueType === EssentialValueType.DATETIME) {
      newValue = moment(newValue).format('DD.MM.YYYY\'T\'HH:mm:ss');
    }

    return newValue;
  }

  chooseField({value}) {
    console.log("chooseField: value: ", value);
    const urn = value;
    const extendedField = this.mdrFieldProviderService.getPossibleField(urn);
    if (extendedField) {
      console.log("chooseField: extendedField: ", extendedField);
      this.queryProviderService.addField(urn, extendedField.mdrDataType);
      this.calculateFilteredFields();
    }
    this.addField.setValue('');

    this.slStorageService.setQuery(this.getQuery());
    console.log("chooseField: DONE");
  }

  private getQueryValue(i: number, j: number) {
    return this.getQueryField(i).valueDtos[j];
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

  getAddFieldStyleClass() {
    if (this.disabled) {
      return 'add-field add-field-disabled';
    } else {
      return 'add-field';
    }
  }

  getDropdownTooltip(extendedField: ExtendedMdrFieldDto, value: string) {
    const index = extendedField.permittedValues.findIndex(permittedValue => permittedValue.value === value);
    if (index < 0) {
      return '';
    } else {
      return extendedField.permittedValues[index].label;
    }
  }

  isLastValueEmpty(i): boolean {
    const valueDtos = this.getQueryField(i).valueDtos;
    if (!valueDtos || valueDtos.length === 0) {
      return true;
    }

    const lastValueDto = valueDtos[valueDtos.length - 1];
    if (lastValueDto.condition === SimpleValueOperator.BETWEEN) {
      return !lastValueDto.value || lastValueDto.value === '' ||
        !lastValueDto.maxValue || lastValueDto.maxValue === '';
    }

    return !lastValueDto.value || lastValueDto.value === '';
  }

  // New code related to the insertion of a checkbox for filtering those patients
  // who have family members with the same condition.
  faCheckSquare = faCheckSquare;
  faSquare = faSquare;

  @Input()
  negFlag = false;

  @Output()
  toggleNegFlag = new EventEmitter();

  toggleRelativesFlag($event: any, i: number, j: number) {
    console.log("toggleRelativesFlag: i,j: ", i, j);
    if (this.disabled) {
      return;
    }

    this.negFlag = !this.negFlag;
    this.toggleNegFlag.emit(this.negFlag);

//    console.log("toggleRelativesFlag: event: ", $event);
    console.log("toggleRelativesFlag: choose field");

    const urn: any = 'urn:mdr16:dataelement:42:1'; // FamilyMember.orpha
    this.chooseFieldToggling(urn);
//    this.chooseOperator($event, i, j);
    console.log("toggleRelativesFlag: changeValueToggler");
    this.changeValueToggler(i, j);
    console.log("toggleRelativesFlag: DONE");
  }

  // Returns either an empty box or a box with a tick, depending on 'negFlag'
  getRelativesIcon(): any {
    return this.negFlag ? this.faCheckSquare : this.faSquare;
  }

  public isRelative(): boolean {
    return this.headerName === "Relatives";
  }

  // Inserting this into the HTML seems to kill off some elements, i.e. it's toxic
  public gqv(i: number, j: number) {
    return this.getQueryValue(i, j).value;
  }

  changeValueToggler(i: number, j: number) {
    console.log("changeValueToggler: i,j: ", i, j);
    const valueType = EssentialValueType.STRING;
    const newValue = "string";

    console.log("changeValueToggler: valueType: ", valueType);
    console.log("changeValueToggler: newValue: ", newValue);
    this.getQueryValue(i, j).value = this.adoptDateFormat(newValue, valueType);

    console.log("changeValueToggler: getQueryValue: ", this.getQueryValue(i, j).value);

    this.addValue(i);
    console.log("changeValueToggler: Added new value")

    console.log("changeValueToggler: getQuery: ", this.getQuery());
    this.slStorageService.setQuery(this.getQuery());
    console.log("changeValueToggler: DONE");
  }

  chooseFieldToggling(urn) {
    console.log("chooseFieldToggling: urn: ", urn);
    const extendedField = this.mdrFieldProviderService.getPossibleField(urn);
    if (extendedField) {
      console.log("chooseFieldToggling: extendedField: ", extendedField);
      this.queryProviderService.addField(urn, extendedField.mdrDataType);
      this.calculateFilteredFields();
    }
    this.addField.setValue('');

    this.slStorageService.setQuery(this.getQuery());
    console.log("chooseFieldToggling: DONE");
  }
}
