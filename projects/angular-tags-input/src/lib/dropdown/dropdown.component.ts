import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ListKeyManager, ListKeyManagerOption } from '@angular/cdk/a11y';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';
import {
  AngularTagItem,
  AngularTagsInputConfig,
  AngularTagsInputDDFns
} from '../tags-input-interfaces';
import { KEY_CODES } from '../constants';

@Component({
  selector: 'ti-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent
  implements OnInit, AngularTagsInputDDFns, OnChanges {
  @Input() config: AngularTagsInputConfig;
  @Input() listItems: Array<AngularTagItem> = [];
  @Input() dropDownTemplate: TemplateRef<any>;
  @Input() tagsLoading: boolean;
  @Input() keyPress: any;
  @Output() itemAdded = new EventEmitter<AngularTagItem>();
  @Output() itemClicked = new EventEmitter<AngularTagItem>();
  @ViewChild('defaultTagOptionTemplate', { static: true })
  defaultTagOptionTemplate: TemplateRef<any>;
  context: any;
  activeIndex: number;
  keyboardEventsManager: ListKeyManager<ListKeyManagerOption>;
  itemsMap: Map<string, any> = new Map<string, any>();
  constructor() {}

  ngOnInit() {
    if (!this.dropDownTemplate) {
      // if there's no template provided, assign the default one
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
    this.keyboardEventsManager = new ListKeyManager([...this.listItems as any]);
    this.populateItemsMap(this.listItems);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listItems && !changes.listItems.firstChange) {
      // if the list items change, update the context items (because they're not automatically updated)
      this.updateItems(changes.listItems.currentValue);
      this.populateItemsMap(changes.listItems.currentValue);
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

  populateItemsMap(items, prefix = null) {
    if (prefix === null) {
      prefix = '';
    } else {
      prefix += '.';
    }
    items.map((item, index) => {
      const newPrefix = prefix + index;
      item.tiIdentifier = newPrefix;
      this.itemsMap[newPrefix] = item;
      if (item[this.config.nestedTagProperty] && item[this.config.nestedTagProperty].length) {
        this.populateItemsMap(item[this.config.nestedTagProperty], newPrefix);
      }
    });
  }

  /**
   * @author Ahsan Ayaz
   * @desc When an option is clicked from the options dropdown
   * @param item - item clicked
   */
  onItemClicked(item: AngularTagItem, $event = null) {
    if ($event) {
      $event.stopImmediatePropagation(); // for nested items
    }
    this.itemClicked.emit(item);
  }

  handleKeyUp(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    if (!this.keyboardEventsManager) {
      return;
    }
    const isKeyDown = this.isKeyDown(event);
    const isKeyUp = this.isKeyUp(event);
    const isKeyEnter = this.isKeyEnter(event);

    if (isKeyDown || isKeyUp) {
      // passing the event to key manager so we get a change fired
      this.setActiveElement(event);
    } else if (
      isKeyEnter &&
      this.keyboardEventsManager.activeItem
    ) {
      this.itemClicked.emit(
        this.keyboardEventsManager.activeItem as AngularTagItem
      );
    }
  }

  isKeyDown(event) {
    // tslint:disable-next-line: deprecation
    return event.key === KEY_CODES.ARROW_DOWN || event.keyCode === DOWN_ARROW;
  }

  isKeyUp(event) {
    // tslint:disable-next-line: deprecation
    return event.key === KEY_CODES.ARROW_UP || event.keyCode === UP_ARROW;
  }

  isKeyEnter(event) {
    // tslint:disable-next-line: deprecation
    return event.key === KEY_CODES.ENTER || event.keyCode === ENTER;
  }

  setActiveElement(event) {
    const isKeyDown = this.isKeyDown(event);
    const isKeyUp = this.isKeyUp(event);
    const previousActiveItem = { ...this.keyboardEventsManager.activeItem } as AngularTagItem;
    if (isKeyDown) {
      this.setNextActiveElement(previousActiveItem, this.listItems);
    } else if (isKeyUp) {
      this.setPreviousActiveElement(previousActiveItem, this.listItems);
    }
    // this.setActiveElementA(previousActiveItem, this.listItems, event);
  }

  setNextActiveElement(currentActiveItem: AngularTagItem, items) {
    const identifier = currentActiveItem.tiIdentifier;
    if (!identifier) {
      items[0].tiKeyboardActive = true;
      this.keyboardEventsManager.setActiveItem(items[0]);
      return;
    }
    const keyIdentifierArr = identifier.split('.');
    const keyIdentifier = keyIdentifierArr.length > 1 ?
      [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1).join('.') + '.' :
      keyIdentifierArr[0];
    const treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}`).test(key));
    const index = treeItems.findIndex(id => id === identifier);
    if (index === treeItems.length - 1) {
      this.setActiveElementRecursively(this.findNextParent(keyIdentifierArr), this.listItems);
    } else {
      this.setActiveElementRecursively(treeItems[index + 1], this.listItems);
    }
  }

  findNextParent(keyIdentifierArr) {
    let keyIdentifier;
    let treeItems;
    if (keyIdentifierArr.length === 1) {
      return `${+keyIdentifierArr[0] + 1}`;
    }
    const nextIdArr = [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1);
    nextIdArr[nextIdArr.length - 1] = `${(+nextIdArr[nextIdArr.length - 1]) + 1}`;
    keyIdentifier = nextIdArr.join('.');
    treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}`).test(key));
    if (treeItems.length) {
      return treeItems[0];
    } else {
      return this.findNextParent([...keyIdentifierArr.splice(0, keyIdentifierArr.length - 1)]);
    }
  }

  setPreviousActiveElement(currentActiveItem: AngularTagItem, items) {
    const identifier = currentActiveItem.tiIdentifier;
    if (!identifier) {
      items[items.length - 1].tiKeyboardActive = true;
      this.keyboardEventsManager.setActiveItem(items[items.length - 1]);
      return;
    }

    const keyIdentifierArr = identifier.split('.');
    const keyIdentifier = keyIdentifierArr.length > 1 ?
      [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1).join('.') + '.' :
      keyIdentifierArr[0];
    const treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}`).test(key));
    const index = treeItems.findIndex(id => id === identifier);
    if (treeItems.length === 1 || index === 0) {
      this.setActiveElementRecursively(this.findPrevousParentLastChild(keyIdentifierArr, identifier), this.listItems);
    } else {
      this.setActiveElementRecursively(treeItems[index - 1], this.listItems);
    }
  }

  findPrevousParentLastChild(keyIdentifierArr, prevItemIdentifier: string) {
    let keyIdentifier;
    const isOnlyItem = keyIdentifierArr.length === 1;
    const prevIdArr = !!isOnlyItem ?
      [...keyIdentifierArr] :
      [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1);
    prevIdArr[prevIdArr.length - 1] = !!isOnlyItem ? `${(+prevIdArr[prevIdArr.length - 1]) - 1}` : prevIdArr[prevIdArr.length - 1];
    keyIdentifier = prevIdArr.join('.');
    const treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}`).test(key));
    if (treeItems.length) {
      if (treeItems.indexOf(prevItemIdentifier) !== -1) {
        return keyIdentifier;
      }
      return treeItems[treeItems.length - 1];
    } else {
      return this.findPrevousParentLastChild([...keyIdentifierArr.splice(0, keyIdentifierArr.length - 1)], prevItemIdentifier);
    }
  }

  setActiveElementRecursively(identifier, items) {
    for (let i = 0, len = items.length; i < len; ++i ) {
      items[i].tiKeyboardActive = false;
      if (items[i].tiIdentifier === identifier) {
        this.keyboardEventsManager = new ListKeyManager([...items as any]);
        items[i].tiKeyboardActive = true; // select next item
        this.keyboardEventsManager.setActiveItem(items[i] as any);
      }
      if (items[i][this.config.nestedTagProperty] && items[i][this.config.nestedTagProperty].length) {
        this.setActiveElementRecursively(identifier, items[i][this.config.nestedTagProperty]);
      }
    }
  }
}
