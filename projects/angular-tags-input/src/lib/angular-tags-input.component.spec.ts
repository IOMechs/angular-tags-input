import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularTagsInputComponent } from './angular-tags-input.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnAddedTagsPipe } from './un-added-tags.pipe';

describe('AngularTagsInputComponent', () => {
  let component: AngularTagsInputComponent;
  let fixture: ComponentFixture<AngularTagsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, ReactiveFormsModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ AngularTagsInputComponent, UnAddedTagsPipe ]
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
