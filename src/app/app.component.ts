import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  priority01 = [];
  priority23 = [];
  priority45 = [];

/*  public schartData: Array<any> = [
    this.priority01,
    this.priority23,
    this.priority45
  ];*/

  public chartData: any[] = [
    {data: 0, label: 'P0, P1'},
    {data: 0, label: 'P2, P3'},
    {data: 0, label: 'P4, P5'}
  ];

  public chartLabels: Array<any> = ['Group1', 'Group2', 'Group3'];

  public chartOptions: any = {
    legend: {
      /*onClick: function(e, p) {
        if (p.datasetIndex == 0) {
          console.log(p);
          p.hidden = true;
        }
      }*/
    },
    scales: {
      xAxes: [{
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
    this.http.get('../assets/sample.csv')
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


  show() {
    let estimate01 = 0;
    let estimate23 = 0;
    let estimate45 = 0;

    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1)
        estimate01 += parseInt(entry[6]);
      else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1)
        estimate23 += parseInt(entry[6]);
      else if((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1)
        estimate45 += parseInt(entry[6]);
    }

    console.log(estimate01);
    console.log(this.priority01);

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2) {
        estimate01 += parseInt(entry[6]);
      }
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2) {
        estimate23 += parseInt(entry[6]);
      }
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2) {
        estimate45 += parseInt(entry[6]);
      }
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3) {
        estimate01 += parseInt(entry[6]);
      }
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3) {
        estimate23 += parseInt(entry[6]);
      }
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3) {
        estimate45 += parseInt(entry[6]);
      }
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    console.log(this.priority01);


    this.chartData = [
      {data: this.priority01, label: 'P0, P1', stack: 'test1'},
      {data: this.priority23, label: 'P2, P3', stack: 'test2'},
      {data: this.priority45, label: 'P4, P5', stack: 'test3'}
    ];
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

   let estimate = [
      [],
      [],
      []
    ];

   this.show();

  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public randomize(): void {

    let estimate01 = 0;
    let estimate23 = 0;
    let estimate45 = 0;

    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Resolved")
        estimate01 += parseInt(entry[6]);
      else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Resolved")
        estimate23 += parseInt(entry[6]);
      else if((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Resolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Resolved")
        estimate01 += parseInt(entry[6]);
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Resolved")
        estimate23 += parseInt(entry[6]);
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Resolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Resolved")
        estimate01 += parseInt(entry[6]);
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Resolved")
        estimate23 += parseInt(entry[6]);
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Resolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    this.chartData = [
      {data: this.priority01, label: 'P0, P1', stack: 'test1'},
      {data: this.priority23, label: 'P2, P3', stack: 'test2'},
      {data: this.priority45, label: 'P4, P5', stack: 'test3'}
    ];

  }


  public unresolved(): void {

    let estimate01 = 0;
    let estimate23 = 0;
    let estimate45 = 0;

    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();
    this.priority01.shift();
    this.priority23.shift();
    this.priority45.shift();

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Unresolved")
        estimate01 += parseInt(entry[6]);
      else if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Unresolved")
        estimate23 += parseInt(entry[6]);
      else if((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 1 && entry[2] == "Unresolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Unresolved")
        estimate01 += parseInt(entry[6]);
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Unresolved")
        estimate23 += parseInt(entry[6]);
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 2 && entry[2] == "Unresolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    for (let entry of this.csvData) {
      if ((entry[5] == 'P0' || entry[5] == 'P1') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Unresolved")
        estimate01 += parseInt(entry[6]);
      if ((entry[5] == 'P2' || entry[5] == 'P3') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Unresolved")
        estimate23 += parseInt(entry[6]);
      if ((entry[5] == 'P4' || entry[5] == 'P5') && isNumeric(parseInt(entry[6])) && this.checkGroup(entry[4]) == 3 && entry[2] == "Unresolved")
        estimate45 += parseInt(entry[6]);
    }

    this.priority01.push(estimate01);
    this.priority23.push(estimate23);
    this.priority45.push(estimate45);

    this.chartData = [
      {data: this.priority01, label: 'P0, P1', stack: 'test1'},
      {data: this.priority23, label: 'P2, P3', stack: 'test2'},
      {data: this.priority45, label: 'P4, P5', stack: 'test3'}
    ];

  }


  /*public lineChartType:string = 'line';
  public pieChartType:string = 'pie';
  public lineChartOptions:any = {
    animation: false,
    responsive: true
  };
  // Pie
  public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData:number[] = [300, 500, 100];
/!*  constructor(private _router: Router, private _auth: Auth, private _config: Config, private _http: Http,  _formBuilder: FormBuilder) {
    console.log(CHART_DIRECTIVES);
  }*!/
  public randomizeType(): void {
    console.log(this.lineChartType);
    this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
    this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
  }
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
    console.log(e);
  }*/

}
