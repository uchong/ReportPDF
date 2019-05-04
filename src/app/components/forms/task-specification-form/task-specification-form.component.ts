import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { TaskModel, TaskService } from 'src/app/services/task';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
// import { UserModel } from 'src/app/services/user';
import { toaster } from 'src/app/library/scdk-library';
import Swal from 'sweetalert2';
// import { UIState } from 'src/app/app.states';
// import { SetDetailViewTab } from 'src/app/interfaceControl/interface-actions';


const LOWEST_PRIORITY = 1;
const HIGHEST_PRIORITY = 3;

@Component({
  selector: 'app-task-specification-form',
  templateUrl: './task-specification-form.component.html',
  styleUrls: ['./task-specification-form.component.scss']
})
export class TaskSpecificationFormComponent implements AfterViewInit {
  @Input() me: any;
  @Input() data: TaskModel;
  @Input() readonly: boolean;
  @Output() action = new EventEmitter <{action: string, params: any}> ();

  public date = new FormControl(new Date());
  public lowestPriority = LOWEST_PRIORITY;
  public highestPriority = HIGHEST_PRIORITY;
  public showAssignButton: boolean = false;
  public showAcceptButton: boolean = false;
  public showStartButton: boolean = false;
  public scheduleCtrl: any ;
  public requestCtrl: any = {readonly: false};

  constructor(public mainService: TaskService,
              public dialog: MatDialog,
              ) { }

  ngAfterViewInit() {
    const isCreator = true;
    const isAssignee = false;

    this.showStartButton = false;
    this.showAcceptButton =  false && isAssignee;
    this.scheduleCtrl = { readonly: !isAssignee,
                           msg: 'Only assignee can schedule the task',
                        };


    // Assignee is god
    this.requestCtrl = { readonly: (isCreator && this.data.accepted),
      msg: 'Requester cannot change the scope of an accepted task',
    };
    // Requester is god
    // this.requestCtrl = { readonly: this.data.creator.id !== this.me.id,
    //   msg: 'Only requester can change the scope of task',
    // };
  }






  onPriorityChange() {
    if (this.data.priority > HIGHEST_PRIORITY) { this.data.priority = HIGHEST_PRIORITY; }
    if (this.data.priority < LOWEST_PRIORITY) { this.data.priority = LOWEST_PRIORITY; }
  }




  buttonAlert(buttonCrtl) {
    if (this.readonly) {
      (Swal as any).fire({
          position: 'bottom',
          type: 'info',
          title: 'You must be in edit mode to change form',
          showConfirmButton: false,
          timer: 5000,
          toast: true,
          footer: '<p>Click on <img heigth="20px"  width="20px" src="./assets/svg/ic_mode_edit_48px.svg">  to edit mode.</p>'
      });
      return;
    }

    if (this.readonly) {return; }
    if (buttonCrtl.readonly) { toaster(buttonCrtl.msg); }
  }

}
