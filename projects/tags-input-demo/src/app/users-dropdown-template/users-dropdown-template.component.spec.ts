import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDropdownTemplateComponent } from './users-dropdown-template.component';

describe('UsersDropdownTemplateComponent', () => {
  let component: UsersDropdownTemplateComponent;
  let fixture: ComponentFixture<UsersDropdownTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDropdownTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDropdownTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
