import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UsersListItemComponent } from "./users-list-item.component";

describe("UsersListItemComponent", () => {
  let component: UsersListItemComponent;
  let fixture: ComponentFixture<UsersListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersListItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListItemComponent);
    component = fixture.componentInstance;
    // Provide mock data for inputs to prevent potential circular structure issues
    component.item = { Id: 1, full_name: "Test User" }; // Simple mock item
    component.config = { displayProperty: "full_name", identifier: "Id" }; // Basic mock config
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
