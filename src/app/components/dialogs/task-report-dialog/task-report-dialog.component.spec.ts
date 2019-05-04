import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskReportDialogComponent } from './task-report-dialog.component';

describe('TaskReportDialogComponent', () => {
  let component: TaskReportDialogComponent;
  let fixture: ComponentFixture<TaskReportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskReportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
