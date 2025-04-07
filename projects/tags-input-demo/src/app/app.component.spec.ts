import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularTagsInputModule } from "angular-tags-input";
import { UsersListItemComponent } from "./users-list-item/users-list-item.component";
import { OverlayModule } from "@angular/cdk/overlay"; // Import OverlayModule

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        AngularTagsInputModule,
        OverlayModule, // Add OverlayModule here
    ],
    declarations: [AppComponent, UsersListItemComponent],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'tags-input-demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("tags-input-demo");
  });

  it("should render title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // Update the expected text to match the actual content in the template
    expect(compiled.querySelector(".content span").textContent).toContain(
      "@iomechs/angular-tags-input"
    );
  });
});
