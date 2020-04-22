import {Component, Input} from '@angular/core';
import {StratificationData} from '../../model/result/stratification-data';

@Component({
  selector: 'app-stratification',
  templateUrl: './stratification.component.html',
  styleUrls: ['./stratification.component.scss']
})
export class StratificationComponent {

  chartOptions = {
    legend: {
      display: false
    },
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    }
  };

  @Input()
  data: StratificationData;

  constructor() {
  }
}
