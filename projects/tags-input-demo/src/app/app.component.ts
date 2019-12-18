import { Component } from '@angular/core';
import { AngularTagsInputConfig, AngularTagsInputService } from 'projects/angular-tags-input/src/public-api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TAGS_DATA_NESTED, TAGS_DATA_SIMPLE } from './data';

@Component({
  selector: 'tid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  simpleForm: FormGroup;
  title = 'tags-input-demo';
  sampleDataNested = TAGS_DATA_NESTED;
  sampleDataSimple = TAGS_DATA_SIMPLE;

  nestedTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    hideDDOnBlur: true,
    nestedTagProperty: 'subOrdinates',
    onlyFromAutoComplete: true,
    additionalClasses: 'ti-tags-input',
    displayProperty: 'name',
    identifier: 'id',
    toggleSelectionOnClick: true,
    nestedTagParentProp: 'parent_id',
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: true,
    ddHasBackdrop: true
  };

  simpleTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    hideDDOnBlur: true,
    nestedTagProperty: 'subOrdinates',
    onlyFromAutoComplete: true,
    additionalClasses: 'ti-tags-input',
    displayProperty: 'full_name',
    identifier: 'Id',
    toggleSelectionOnClick: true,
    nestedTagParentProp: 'parent_id',
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: true,
    ddHasBackdrop: false
  };

  constructor(private fb: FormBuilder, private tagsInputService: AngularTagsInputService) {
    this.simpleForm = this.fb.group({
      users: [[], []]
    });
    this.tagsInputService.setDebugMode(true);
  }

  onValChanged($event) {
  }

  onTagAdded($event) {
    console.log(this.simpleForm.value);
  }
}
