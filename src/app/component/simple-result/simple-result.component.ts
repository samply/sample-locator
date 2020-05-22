import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from '../../service/user.service';
import {ReplySite, Stratification} from '../../model/result/reply-dto';
import {StratificationData} from '../../model/result/stratification-data';
import {FeatureService} from '../../service/feature.service';

@Component({
  selector: 'app-simple-result',
  templateUrl: './simple-result.component.html',
  styleUrls: ['./simple-result.component.scss']
})
export class SimpleResultComponent implements OnInit, OnChanges {

  constructor(
    public userService: UserService,
    public featureService: FeatureService
  ) {
  }

  static backgroundColor = '#8C96A5';
  static borderColor = '#172B49';

  @Input()
  aggregatedResult: ReplySite;

  @Input()
  biobanksAnswered = 0;

  @Input()
  biobanksWithStratifications = 0;

  dataSex: StratificationData;
  dataAge: StratificationData;
  dataSampleType: StratificationData;

  ngOnInit(): void {
    this.initStratificationData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateStratificationData(this.aggregatedResult.donor.stratifications, 'Donors / ');
    this.calculateStratificationData(this.aggregatedResult.sample.stratifications, 'Samples / ');
  }

  private calculateStratificationData(stratifications: Array<Stratification>, titlePrefix = '') {
    if (!stratifications || stratifications.length === 0) {
      this.initStratificationData();
      return;
    }

    for (const stratification of stratifications) {
      const data = [];
      const labels = [];
      const title = stratification.title;

      for (const stratum of stratification.strata) {
        labels.push(stratum.label);
        data.push(stratum.count);
      }

      const stratificationData: StratificationData = {
        labels,
        datasets: [{
          label: titlePrefix + title,
          backgroundColor: SimpleResultComponent.backgroundColor,
          borderColor: SimpleResultComponent.borderColor,
          data
        }]
      };

      if (stratification.title === 'Age') {
        this.dataAge = stratificationData;
        this.dataAge.title = 'Age';
      } else if (stratification.title === 'Gender') {
        this.dataSex = stratificationData;
        this.dataSex.title = 'Gender';
      } else if (stratification.title === 'SampleType') {
        this.dataSampleType = stratificationData;
        this.dataSampleType.title = 'Sample Type';
      }
    }
  }

  private initStratificationData() {
    this.dataSampleType = {
      title: 'Sample Type',
      labels: ['fluid', 'tissue', 'other'],
      datasets: this.createEmptyDatasets('SampleType', 3)
    };

    this.dataAge = {
      title: 'Age',
      labels: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'],
      datasets: this.createEmptyDatasets('Age', 10)
    };

    this.dataSex = {
      title: 'Gender',
      labels: ['Female', 'Male'],
      datasets: this.createEmptyDatasets('Gender', 2)
    };
  }

  // noinspection JSMethodCanBeStatic
  private createEmptyDatasets(label: string, noItems: number) {
    const data = [];
    for (let i = 0; i < noItems; i++) {
      data.push(0);
    }

    return [
      {
        label,
        backgroundColor: SimpleResultComponent.backgroundColor,
        borderColor: SimpleResultComponent.borderColor,
        data
      }
    ];
  }
}
