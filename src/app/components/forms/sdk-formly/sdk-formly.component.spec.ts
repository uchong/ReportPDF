import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdkFormlyComponent } from './sdk-formly.component';

describe('SdkFormlyComponent', () => {
  let component: SdkFormlyComponent;
  let fixture: ComponentFixture<SdkFormlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdkFormlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdkFormlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
