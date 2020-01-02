import { Component, OnInit, Input } from '@angular/core';
import { AngularTagsInputConfig, AngularTagsInputDDFns, AngularTagItem } from 'projects/angular-tags-input/src/public-api';
import { TAGS_DATA_IMAGES } from '../data';

@Component({
  selector: 'tid-users-dropdown-template',
  templateUrl: './users-dropdown-template.component.html',
  styleUrls: ['./users-dropdown-template.component.scss']
})
export class UsersDropdownTemplateComponent implements OnInit {
  constructor() { }
  @Input() items;
  @Input() config: AngularTagsInputConfig;
  @Input() fns: AngularTagsInputDDFns;
  @Input() tagsLoading: boolean;


  ngOnInit() {
    this.items = TAGS_DATA_IMAGES;
  }

}
