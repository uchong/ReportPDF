import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SafePipe } from './safe.pipe';


import { AppComponent } from './app.component';
import { TaskReportDialogComponent } from './components/dialogs/task-report-dialog/task-report-dialog.component';
import { MaterialModules } from './material.module';
import { CustomPropertiesFormComponent } from './components/forms/custom-properties-form/custom-properties-form.component';
import { TaskSpecificationFormComponent } from './components/forms/task-specification-form/task-specification-form.component';
import { SdkFormlyComponent } from './components/forms/sdk-formly/sdk-formly.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyInputComponent, FormlyH1Component, FormlySubsectionComponent,
         FormlySeparatorComponent, FormlyTextComponent,
          FormlyCheckboxComponent } from './components/forms/sdk-formly/custom-types/formlyCustomTypes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TaskReportDialogComponent,
    CustomPropertiesFormComponent,
    TaskSpecificationFormComponent,
    SdkFormlyComponent,
    FormlyH1Component,
    FormlySeparatorComponent,
    FormlyInputComponent,
    FormlySubsectionComponent,
    FormlyTextComponent,
    FormlyCheckboxComponent,
    SafePipe,
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModules,
    FormlyModule.forRoot({
      types: [
         {name: 'lbInput', component: FormlyInputComponent},
         {name: 'h1', component: FormlyH1Component},
         {name: 'h2', component: FormlySubsectionComponent},
         {name: 'separator', component: FormlySeparatorComponent},
         {name: 'lbTextarea', component: FormlyTextComponent},
         {name: 'lbCheckbox', component: FormlyCheckboxComponent},
      ]
     }
     ),
  ],
  entryComponents: [TaskReportDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
