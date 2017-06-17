import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  csvData: any[] = [];
  priority: any[] = [[], [], []];

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

  filter = '';
  shown = '';
  show = false;

  constructor (private http: Http) {}


  readCsvData () {
    this.http.get('assets/data.csv')
      .subscribe(
        data => this.extractData(data),
        err => console.log(err)
      );
  }


  private extractData(res: Response) {
    let csvData = res['_body'] || '';
    let allTextLines = csvData.split(/\r\n|\n/);
    let headers = allTextLines[0].split(';');
    let lines = [];

    for (let i = 0; i < allTextLines.length; i++) {
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
    this.chartFilter('Original');
  }


  public chartFilter(filter) {

    let estimate01 = 0;
    let estimate23 = 0;
    let estimate45 = 0;

    this.priority = [[], [], []];

    if (filter != 'Groups')
      this.filter = filter;
    else if (this.chartLabels.length > 1)
      this.chartLabels.pop();
    else {
      this.chartLabels.push('Group 2');
      this.chartLabels.push('Group 3');
    }

    if (this.filter == 'Original') {
      for (let i = 1; i <= 3; i++) {
        for (let entry of this.csvData) {
          if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i) {
            estimate01 += parseInt(entry[6]);
            console.log(estimate01);
          }
          else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i)
            estimate23 += parseInt(entry[6]);
          else if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i)
            estimate45 += parseInt(entry[6]);
        }
        this.priority[0].push(estimate01);
        this.priority[1].push(estimate23);
        this.priority[2].push(estimate45);
        estimate01 = 0;
        estimate23 = 0;
        estimate45 = 0;
      }
    } else if (this.filter == 'Resolved' || this.filter == 'Unresolved') {
      for (let i = 1; i <= 3; i++) {
        for (let entry of this.csvData) {
          if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.filter)
            estimate01 += parseInt(entry[6]);
          else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.filter)
            estimate23 += parseInt(entry[6]);
          else if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == i && entry[2] == this.filter)
            estimate45 += parseInt(entry[6]);
        }
        this.priority[0].push(estimate01);
        this.priority[1].push(estimate23);
        this.priority[2].push(estimate45);
        estimate01 = 0;
        estimate23 = 0;
        estimate45 = 0;
      }
    }

    this.chartData = [
      {data: this.priority[0], label: 'P0, P1', stack: 'test1'},
      {data: this.priority[1], label: 'P2, P3', stack: 'test2'},
      {data: this.priority[2], label: 'P4, P5', stack: 'test3'}
    ];

  }


  checkGroup(member) {
    if (member == 'TeamMember1' || member == 'TeamMember2' || member == 'TeamMember3' || member == 'TeamMember4') return 1;
    else if (member == 'TeamMember5' || member == 'TeamMember6' || member == 'TeamMember7') return 2;
    else return 3;
  }


  showData() {
    this.show ? this.show = false : this.show = true;
  }


}
