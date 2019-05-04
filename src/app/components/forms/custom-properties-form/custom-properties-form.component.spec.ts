import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPropertiesFormComponent } from './custom-properties-form.component';

describe('CustomPropertiesFormComponent', () => {
  let component: CustomPropertiesFormComponent;
  let fixture: ComponentFixture<CustomPropertiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPropertiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPropertiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
