import { Component, OnInit, OnChanges } from '@angular/core';
import { FieldType, FormlyFieldConfig  as FG, FormlyFieldConfig} from '@ngx-formly/core';
import {Subject, Subscription} from 'rxjs';
import { Model } from 'src/app/library/scdk-library';
import { FormlyLifeCycleOptions, FormlyTemplateOptions } from '@ngx-formly/core/lib/components/formly.field.config';
import { AbstractControl } from '@angular/forms';
import { SDKFormlyFormOptions } from '../sdk-formly.component';

export class ClassFormlyConfig implements FG {
    key?: string;
    id?: string;
    name?: string;
    templateOptions?: FormlyTemplateOptions;
    optionsTypes?: string[];
    validation;
    validators;
    asyncValidators;
    template;
    wrappers?: string[];
    hide?: boolean;
    hideExpression?: boolean | string | ((model: any, formState: any) => boolean);
    expressionProperties?: {
        [property: string]: string | ((model: any, formState: any) => boolean);
    } | any;
    formControl?: AbstractControl;
    className?: string;
    fieldGroupClassName?: string;
    fieldGroup?: FormlyFieldConfig[];
    fieldArray?: FormlyFieldConfig;
    type?: string;
    component?: any;
    focus?: boolean;

    modelOptions?: {
        debounce?: {
            default: number;
        };

        updateOn?: 'change' | 'blur' | 'submit';
    };
    lifecycle?: FormlyLifeCycleOptions;
    defaultValue?: any;
    parsers?: ((value: any) => {})[];

}

export class SDKFormlyFieldConfig extends ClassFormlyConfig {
  selected?: boolean = false;
}


const FormlyFieldConfig = SDKFormlyFieldConfig;

export const availableFormFields: any[] = [
    {
         key: 'h1',
        className: 'formlytemplate__h1',
        type: 'h1',
        templateOptions: {
            'templateTitle': 'Title',
            'iconUrl': 'assets/svg/lb_title.svg',
            'label': 'Title',
            'placeholder': 'Add a Title',
            'required': false,
            'editMode': true,
            'readonly': false
        }
    },

    {
        key: 'h2',
        className: 'formlytemplate__h2',
        type: 'h2',
        templateOptions: {
            'templateTitle': 'Text',
            'iconUrl': 'assets/svg/lb_subtitle.svg',
            'label': 'Text',
            'placeholder': 'Text',
            'required': false,
            'editMode': true,
            'readonly': false
        }
    },

{
        key: 'separator',
        className: 'formlytemplate_separator',
        type: 'separator',
        templateOptions: {
            'templateTitle': 'Horizontal Line',
            'iconUrl': 'assets/svg/lb_horizontal_line_24px.svg',
            'label': 'Line',
            'placeholder': 'Horizontal Line',
            'required': false,
            'editMode': true,
            'readonly': false
        }
      },
{
        key: 'textQuarter',
        className: 'formlytemplate_textQuarter',
        type: 'lbInput',
        templateOptions: {
            'templateTitle': 'Small text box',
            'iconUrl': 'assets/svg/lb_textinput_small.svg',
            'label': 'Field',
            'placeholder': '',
            'required': false,
            'inputWidth': 'small',
            'editMode': true,
            'readonly': false
        }
    }
, {
        key: 'textHalf',
        className: 'formlytemplate_textHalf',
        type: 'lbInput',
        templateOptions: {
            'templateTitle': 'Medium text box',
            'iconUrl': 'assets/svg/lb_textinput.svg',
            'label': 'Field',
            'placeholder': '',
            'required': false,
            'inputWidth': 'medium',
            'editMode': true,
            'readonly': false
        }
      },
{
        key: 'textFull',
        className: 'formlytemplate_textFull',
        type: 'lbInput',
        templateOptions: {
            'templateTitle': 'Large text box',
            'iconUrl': 'assets/svg/lb_textinput_large.svg',
            'label': 'Field',
            'placeholder': 'Full width text',
            'required': false,
            'inputWidth': 'full',
            'editMode': true,
            'readonly': false
        }
    },
    {
        key: 'textarea',
        className: 'formlytemplate_textDescription',
        type: 'lbTextarea',
        templateOptions: {
            'templateTitle': 'Text area',
            'iconUrl': 'assets/svg/ic_keyboard_48px.svg',
            'label': 'Description',
            'placeholder': '',
            'required': false,
            'editMode': true,
            'readonly': false
        }
      },

      {
        key: 'checkbox',
        className: 'formlytemplate_textDescription',
        type: 'lbCheckbox',
        templateOptions: {
            'templateTitle': 'Check box',
            'iconUrl': 'assets/svg/ic_check_circle_black_48px.svg',
            'label': 'Description',
            'placeholder': '',
            'required': false,
            'editMode': true,
            'readonly': false
        }
      }
];


export function loadFormFields(key) {
    const field = Model.getObject(availableFormFields, {key});
    if (field) {return {...field};
    } else { return null; }
  }



 class EmitterService {
  public events = new Subject();
  subscribe (next, error, complete): Subscription {
    return this.events.subscribe(next, error, complete);
  }
  next (event) {
    this.events.next(event);
  }
}

export const fieldEmitterService = new EmitterService();

export class SdkFieldType extends FieldType implements OnInit, OnChanges {
    public settingOptions: any;
    public selected;
    public field: SDKFormlyFieldConfig;
    public options: SDKFormlyFormOptions;

    constructor() {
        super();
    }

    ngOnInit() {
        this.field['select'] = false;
    }

    dblclickFunc(ev, options) {
        this.field['select'] =  !this.field['select'];
        const change = {
            action: 'select',
            id: this.field.id
        };

        fieldEmitterService.next(change);
    }




    // const {value: formValues} = await Swal.fire({
    //     title: 'Multiple inputs',
    //     html:
    //       '<input id="swal-input1" class="swal2-input">' +
    //       '<input id="swal-input2" class="swal2-input">',
    //     focusConfirm: false,
    //     preConfirm: () => {
    //       return [
    //         document.getElementById('swal-input1').value,
    //         document.getElementById('swal-input2').value
    //       ]
    //     }
    //   })

    //   if (formValues) {
    //     Swal.fire(json.stringify(formValues))
    //   }


    deleteFunc() {
        this.field.hideExpression = true;
        const change = {
            action: 'delete',
            id: this.field.id
        };

        fieldEmitterService.next(change);
    }

    onMoveUp(ev) {
        const change = {
            action: 'moveUp',
            id: this.field.id
        };

        fieldEmitterService.next(change);
    }

    onMoveDown(ev) {
        const change = {
            action: 'moveDown',
            id: this.field.id
        };

        fieldEmitterService.next(change);
    }

    onFormat(ev) {
        const change = {
            action: 'format',
            id: this.field.id,
            templateOptions: this.to,
            type: this.field.type
        };

        fieldEmitterService.next(change);

    }


}


@Component({
 selector: 'app-formly-h1',
 templateUrl: './FormTemplate__headline.html',
 styleUrls: ['../sdk-formly.component.scss']

})
export class FormlyH1Component extends SdkFieldType implements OnInit {

    ngOnInit() {
            this.field.className = 'formlytemplate__h1';
    }
}


@Component({
    selector: 'app-formly-input',
    templateUrl: './FormTemplate__lbInput.html',
    styleUrls: ['../sdk-formly.component.scss']
   })
   export class FormlyInputComponent extends SdkFieldType implements OnInit, OnChanges {
       public className: string;


       ngOnInit() {
            this.settingOptions = {
                small : 'formlytemplate_textQuarter',
                medium : 'formlytemplate_textHalf',
                full : 'formlytemplate_textFull',
            };

            this.field.className = this.settingOptions[this.to.inputWidth];
       }

       ngOnChanges(obj) {
        // this.field.className = this.settingOptions[this.to.inputWidth];
       }
   }


   @Component({
    selector: 'app-formly-textarea',
    templateUrl: './FormTemplate__lbTextarea.html',
    styleUrls: ['../sdk-formly.component.scss']

   })
   export class FormlyTextComponent extends SdkFieldType implements OnInit {

    ngOnInit() {
        this.field.className = 'formlytemplate_textDescription';
    }
   }



   @Component({
    selector: 'app-formly-h1',
    templateUrl: './FormTemplate__separator.html',
    styleUrls: ['../sdk-formly.component.scss']

   })
   export class FormlySeparatorComponent extends SdkFieldType {


   }


   @Component({
    selector: 'app-formly-h1',
    templateUrl: './FormTemplate__subsection.html',
    styleUrls: ['../sdk-formly.component.scss']

   })
   export class FormlySubsectionComponent extends SdkFieldType implements OnInit {

    ngOnInit() {
        this.field.className = 'formlytemplate__h2';
    }

   }

   @Component({
    selector: 'app-formly-h1',
    templateUrl: './FormTemplate__checkbox.html',
    styleUrls: ['../sdk-formly.component.scss']

   })
   export class FormlyCheckboxComponent extends SdkFieldType implements OnInit {

    ngOnInit() {
        this.field.className = 'formlytemplate__checkbox';
    }

   }
