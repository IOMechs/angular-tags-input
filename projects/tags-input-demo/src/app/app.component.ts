import { Component } from '@angular/core';
import { AngularTagsInputConfig } from 'projects/angular-tags-input/src/public-api';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'tid-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  simpleForm: FormGroup;
  title = 'tags-input-demo';
  sampleData = [{
    id: '1',
    name: 'Ahsan',
    designation: 'Senior engineer'
  }, {
    id: '2',
    name: 'Saad',
    designation: 'Software engineer'
  }, {
    id: '3',
    name: 'Mohsin',
    designation: 'Software engineer'
  }, {
    id: '4',
    name: 'Siraj',
    designation: 'Senior engineer'
  }];

  simpleTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    nestedTagProperty: 'sub_location',
    onlyFromAutoComplete: true,
    additionalClasses: 'ti-tags-input',
    displayProperty: 'name',
    identifier: 'id',
    toggleSelectionOnClick: true,
    nestedTagParentProp: 'parent_id',
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    childrenCountProperty: 'sub_locations_count',
    hideTags: true,
  };

  constructor(private fb: FormBuilder) {
    this.simpleForm = this.fb.group({
      users: [[], []]
    });
  }

  onValChanged($event) {
  }

  onTagAdded($event) {
    console.log(this.simpleForm.value);
  }
}
