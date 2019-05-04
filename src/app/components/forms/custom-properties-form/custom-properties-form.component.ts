import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormlyFormOptions, FormlyField } from '@ngx-formly/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskTemplateModel } from 'src/app/services/task';
import { SDKFormlyFormOptions } from '../sdk-formly/sdk-formly.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-custom-properties-form',
  templateUrl: './custom-properties-form.component.html',
  styleUrls: ['./custom-properties-form.component.scss']
})
export class CustomPropertiesFormComponent implements OnInit, OnChanges {
  @Input() item: any;
  @Input() readonly: boolean;
  @Input() formFieldName: string;
  @Input() dataFieldName: string;
  @Input() templateService: any;
  @Output() changes = new EventEmitter<any>();


  public options: SDKFormlyFormOptions;
  public dynamicForm;
  public templateFields: any;
  public interfaceSubscription: Subscription;
  public selectedEntity;
  public jCustomForm: TaskTemplateModel;
  public jFormData: any;
  public customizing: boolean;

  constructor( public dialog: MatDialog) {}

  ngOnInit() {
    this.options = {formState: {}};
  }

  ngOnChanges(obj) {
    if (obj.item) {
      if (!this.item[this.dataFieldName]) {this.item[this.dataFieldName] = {}; }
      this.jCustomForm = this.item[this.formFieldName];
      this.jFormData = this.item[this.dataFieldName];
    }
  }


  onSubmit(jsonData: any) {

  }


}
