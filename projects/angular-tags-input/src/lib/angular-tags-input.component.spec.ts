import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularTagsInputComponent } from './angular-tags-input.component';

describe('AngularTagsInputComponent', () => {
  let component: AngularTagsInputComponent;
  let fixture: ComponentFixture<AngularTagsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularTagsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularTagsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
