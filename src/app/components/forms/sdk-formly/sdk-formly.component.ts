import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormlyFormOptions, FormlyField, FormlyConfig, FormlyFieldConfig as FG } from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';
import * as loadash from 'lodash';
import { fieldEmitterService} from './custom-types/formlyCustomTypes';
import { Subscription } from 'rxjs';

export class ClassFormlyFormOptions implements FormlyFormOptions {}


export class SDKFormlyFormOptions extends ClassFormlyFormOptions {
  selected?: boolean = false;
  formState?: any;
}
export class ClassFormlyConfig implements FG {}


export class SDKFormlyFieldConfig extends ClassFormlyConfig {
  selected?: boolean = false;

}
export const FormlyFieldConfig = SDKFormlyFieldConfig;

@Component({
  selector: 'app-sdk-formly',
  templateUrl: './sdk-formly.component.html',
  styleUrls: ['./sdk-formly.component.scss']
})
export class SdkFormlyComponent implements OnInit , OnChanges, OnDestroy {
  @Input() fields: FormlyField[];
  @Input() form: FormGroup;
  @Input() readonly: boolean;
  @Input() model: any;
  @Input() options: SDKFormlyFormOptions = {};
  @Output() submit = new EventEmitter <any> ();
  @Output() fieldsUpdate = new EventEmitter <any> ();

  public templateFields: any;
  public subscription: Subscription;

  constructor() {
    this.subscription = fieldEmitterService.subscribe(msg => this.onFieldUpdates(msg), () => {}, () => {});
  }


  onFieldUpdates(change) {
    let field;
    let fieldIndex: number;
    let fieldDisplaced;
    const clonedFields = loadash.cloneDeep(this.templateFields);


    this.fieldsUpdate.emit(clonedFields);
  }


  ngOnInit() {
    this.loadFormly();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(obj) {
    if (obj.fields) {
      this.loadFormly();
    }
  }

  loadFormly() {
    this.templateFields = this.fields;
    this.setReadonly(this.templateFields, this.readonly);
  }

  setReadonly(templateFields, readonly: boolean) {
    if (!templateFields) { return; }
    templateFields.forEach(field => {
      if (!field) { return; }
      if (!field.templateOptions) {field.templateOptions = {}; }
      field.templateOptions['readonly'] = readonly;
      if (readonly) { field.selected = false; }
    });
  }



}
