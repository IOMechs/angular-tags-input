import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OverlayModule } from "@angular/cdk/overlay";
import { DropdownComponent } from "./dropdown.component";
import { KeyboardActiveClassDirective } from "../keyboard-active-class/keyboard-active-class.directive";

describe("DropdownComponent", () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent, KeyboardActiveClassDirective],
      imports: [OverlayModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
