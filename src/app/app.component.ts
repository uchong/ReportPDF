import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task/task.service';
import { TaskReportDialogComponent } from './components/dialogs/task-report-dialog/task-report-dialog.component';
import { TaskModel } from './services/task/task.models';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'scdk-app';
  item: TaskModel;


  constructor(
    public mainService: TaskService, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.mainService.get(2).subscribe(r => this.item = r);
  }


  openReport() {
    const dialogRef = this.dialog.open(TaskReportDialogComponent, {
      width: '1000px',
      height: '800px',
      data: this.item,
      panelClass: 'sdk-mat-dialog'
      });
      return dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
  }

}
