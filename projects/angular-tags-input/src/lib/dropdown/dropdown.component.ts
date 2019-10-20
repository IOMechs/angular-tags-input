import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { AngularTagItem, AngularTagsInputConfig, AngularTagsInputDDFns } from '../tags-input-interfaces';

@Component({
  selector: 'ti-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit, AngularTagsInputDDFns, OnChanges {
  @Input() config: AngularTagsInputConfig;
  @Input() listItems: Array<AngularTagItem> = [];
  @Input() dropDownTemplate: TemplateRef<any>;
  @Input() tagsLoading: boolean;
  @Output() itemAdded = new EventEmitter<AngularTagItem>();
  @Output() itemClicked = new EventEmitter<AngularTagItem>();
  @ViewChild('defaultTagOptionTemplate', { static: true }) defaultTagOptionTemplate: TemplateRef<any>;
  context: any;
  constructor() { }

  ngOnInit() {
    if (!this.dropDownTemplate) { // if there's no template provided, assign the default one
      this.dropDownTemplate = this.defaultTagOptionTemplate;
    }
    this.context = {
      items: this.listItems,
      config: this.config,
      tagsLoading: this.tagsLoading,
      fns: {
        onItemClicked: this.onItemClicked.bind(this)
      }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.listItems && !changes.listItems.firstChange
    ) {
      // if the list items change, update the context items (because they're not automatically updated)
      this.updateItems(changes.listItems.currentValue);
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Updates the items property for the context provided to the dropdown template
   * @param itemsUpdated - the updated list of items
   */
  updateItems(itemsUpdated) {
    this.context.items = itemsUpdated;
  }

  /**
   * @author Ahsan Ayaz
   * @desc When an option is clicked from the options dropdown
   * @param item - item clicked
   */
  onItemClicked(item: AngularTagItem) {
    this.itemClicked.emit(item);
  }

}
