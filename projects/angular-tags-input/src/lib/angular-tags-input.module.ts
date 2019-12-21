import { NgModule } from '@angular/core';
import { AngularTagsInputComponent } from './angular-tags-input.component';
import { TagComponent } from './tag/tag.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { UnAddedTagsPipe } from './un-added-tags.pipe';
import { DropdownItemsFilterPipe } from './dropdown-items-filter.pipe';

@NgModule({
  declarations: [
    AngularTagsInputComponent,
    TagComponent,
    TagInputComponent,
    DropdownComponent,
    UnAddedTagsPipe,
    DropdownItemsFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  exports: [AngularTagsInputComponent]
})
export class AngularTagsInputModule { }
