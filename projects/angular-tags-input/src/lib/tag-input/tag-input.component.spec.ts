import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagInputComponent } from './tag-input.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('TagInputComponent', () => {
  let component: TagInputComponent;
  let fixture: ComponentFixture<TagInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [TagInputComponent],
    imports: [ReactiveFormsModule],
    teardown: { destroyAfterEach: false }
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
