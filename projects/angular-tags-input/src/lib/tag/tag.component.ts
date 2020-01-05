import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { AngularTagItem, AngularTagsInputConfig } from '../tags-input-interfaces';

@Component({
  selector: 'ti-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() config: AngularTagsInputConfig;
  @Input() tagItem: AngularTagItem;
  @Input() tagClass = 'default-tag';
  @Input() tagItemTemplate: TemplateRef<any>;
  @Output() closeClicked = new EventEmitter<AngularTagItem>();
  @ViewChild('defaultTagItemTemplate', { static: true }) defaultTagItemTemplate: TemplateRef<any>;
  context: any;
  constructor() { }

  ngOnInit() {
    if (!this.tagItemTemplate) { // if there's no template provided, assign the default one
      this.tagItemTemplate = this.defaultTagItemTemplate;
    }
    this.context = {
      item: this.tagItem,
      config: this.config,
      tagClass: this.tagClass,
      closeClicked: this.closeClicked
    };
  }

}
