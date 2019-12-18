import { NgModule } from '@angular/core';
import { AngularTagsInputComponent } from './angular-tags-input.component';
import { TagComponent } from './tag/tag.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { UnAddedTagsPipe } from './un-added-tags.pipe';
import { KeyboardActiveClassDirective } from './keyboard-active-class/keyboard-active-class.directive';

@NgModule({
  declarations: [
    AngularTagsInputComponent,
    TagComponent,
    TagInputComponent,
    DropdownComponent,
    UnAddedTagsPipe,
    KeyboardActiveClassDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  exports: [AngularTagsInputComponent, KeyboardActiveClassDirective]
})
export class AngularTagsInputModule { }
