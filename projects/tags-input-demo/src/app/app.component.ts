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
    designation: 'Senior engineer',
    subOrdinates: [{
      id: '1.1',
      name: 'Ali',
      designation: 'Software engineer'
    }, {
      id: '1.2',
      name: 'Asghar',
      designation: 'Software engineer'
    }]
  }, {
    id: '2',
    name: 'Saad',
    designation: 'Software engineer',
    subOrdinates: [{
      id: '2.1',
      name: 'Zuhair',
      designation: 'Software engineer',
      subOrdinates: [{
        id: '2.1.1',
        name: 'Yawar',
        designation: 'Software engineer'
      }, {
        id: '2.1.2',
        name: 'Abbas',
        designation: 'Software engineer'
      }]
    }, {
      id: '2.2',
      name: 'Mehdi',
      designation: 'Software engineer',
      subOrdinates: [{
        id: '2.2.1',
        name: 'Zainab',
        designation: 'Software engineer'
      }, {
        id: '2.2.2',
        name: 'Salim',
        designation: 'Software engineer'
      }]
    }]
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
