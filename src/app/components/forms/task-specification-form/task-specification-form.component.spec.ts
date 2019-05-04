import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSpecificationFormComponent } from './task-specification-form.component';

describe('TaskSpecificationFormComponent', () => {
  let component: TaskSpecificationFormComponent;
  let fixture: ComponentFixture<TaskSpecificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSpecificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSpecificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
