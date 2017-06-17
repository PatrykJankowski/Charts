import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { isNumeric } from 'rxjs/util/isNumeric';
import {showWarningOnce} from "tslint/lib/error";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  priority01 = [];
  priority23 = [];
  priority45 = [];

  temp = '';
  shown: string = '';
  show: boolean = false;

  public chartData: any[] = [
    {data: 0, label: 'P0, P1'},
    {data: 0, label: 'P2, P3'},
    {data: 0, label: 'P4, P5'}
  ];

  public chartLabels: Array<any> = ['Group 1', 'Group 2', 'Group 3'];

  public chartOptions: any = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days (sum of \'estimates\')'
        },
        scaleOverride: true,
        scaleSteps: 10,
        scaleStepWidth: 10,
        scaleStartValue: 0,
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };

  csvData: any[] = [];

  constructor (private http: Http) {}

  readCsvData () {
    this.http.get('assets/sample.csv')
      .subscribe(
        data => this.extractData(data),
        err => console.log(err)
      );
  }


  //sprawdzac z pliku z danymi
  checkGroup(member) {
    if (member == 'TeamMember1' || member == 'TeamMember2' || member == 'TeamMember3' || member == 'TeamMember4') return 1;
    else if (member == 'TeamMember5' || member == 'TeamMember6' || member == 'TeamMember7') return 2;
    else return 3;
  }

  private extractData(res: Response) {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(';');
    let lines = [];

    for ( let i = 0; i < allTextLines.length; i++) {
      let data = allTextLines[i].split(';');
      if (data.length == headers.length) {
        let tarr = [];
        for ( let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
    }
    this.csvData = lines;
    this.filter('Original');
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  showData() {
    this.show ? this.show = false : this.show = true;
  }

  public filter(filter) {

    let estimate01 = 0;
    let estimate23 = 0;
    let estimate45 = 0;

    this.priority01 = [];
    this.priority23 = [];
    this.priority45 = [];


    if (filter != 'Groups')
      this.temp = filter;
    else if (this.chartLabels.length > 1)
      this.chartLabels.pop();
    else {
      this.chartLabels.unshift('Group 2');
      this.chartLabels.unshift('Group 1');
    }

    if (this.temp == 'Original') {
      for (let i = 1; i <= 3; i++) {
        for (let entry of this.csvData) {
          if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i)
            estimate01 += parseInt(entry[6]);
          else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i)
            estimate23 += parseInt(entry[6]);
          else if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i)
            estimate45 += parseInt(entry[6]);
        }
        this.priority01.push(estimate01);
        this.priority23.push(estimate23);
        this.priority45.push(estimate45);

      }
    } else if (this.temp == 'Resolved' || this.temp == 'Unresolved') {
      for (let i = 1; i <= 3; i++) {

        for (let entry of this.csvData) {
          if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.temp)
            estimate01 += parseInt(entry[6]);
          else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.temp)
            estimate23 += parseInt(entry[6]);
          else if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.temp)
            estimate45 += parseInt(entry[6]);
        }
        this.priority01.push(estimate01);
        this.priority23.push(estimate23);
        this.priority45.push(estimate45);
      }
    }

    this.chartData = [
      {data: this.priority01, label: 'P0, P1', stack: 'test1'},
      {data: this.priority23, label: 'P2, P3', stack: 'test2'},
      {data: this.priority45, label: 'P4, P5', stack: 'test3'}
    ];

  }

}
