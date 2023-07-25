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
import { AngularTagsInputService } from '../angular-tags-input.service';
import { DropdownItemsFilterPipe } from '../dropdown-items-filter.pipe';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

@Component({
  selector: 'ti-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent
  implements OnInit, AngularTagsInputDDFns, OnChanges {
  @Input() config: AngularTagsInputConfig;
  @Input() listItems: Array<AngularTagItem> = [];
  @Input() inputVal = '';
  @Input() dropDownTemplate: TemplateRef<any>;
  @Input() tagsLoading: boolean;
  @Input() keyPress: any;
  @Output() itemAdded = new EventEmitter<AngularTagItem>();
  @Output() itemClicked = new EventEmitter<AngularTagItem>();
  @ViewChild('defaultTagOptionTemplate', { static: true }) defaultTagOptionTemplate: TemplateRef<any>;
  dropdownItemsFilter = new DropdownItemsFilterPipe();
  ddIdPrefix: string;
  context: any;
  activeIndex: number;
  identifierSeparator = '__';
  keyboardEventsManager: ListKeyManager<ListKeyManagerOption>;
  itemsMap: Map<string, any> = new Map<string, any>();
  tooltipForInput: string;
  inputTooltipOverlayOrigin: CdkOverlayOrigin;
  tooltipTimeout: any;
  inputTooltipShown: boolean;
  constructor(
    private tagsInputService: AngularTagsInputService
  ) {}

  ngOnInit() {
    if (!this.dropDownTemplate) {
      // if there's no template provided, assign the default one
      this.dropDownTemplate = this.defaultTagOptionTemplate;
    }
    this.context = {
      items: [...this.listItems],
      config: this.config,
      tagsLoading: this.tagsLoading,
      fns: {
        onItemClicked: this.onItemClicked.bind(this),
        showTooltip: this.showTooltip.bind(this),
        hideTooltip: this.hideTooltip.bind(this)
      }
    };
    this.keyboardEventsManager = new ListKeyManager([...this.listItems as any]);
    this.populateItemsMap(this.listItems);
    this.ddIdPrefix = this.getRandomString();
    this.tagsInputService.log(this.itemsMap, 'items populated initially');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.listItems && !changes.listItems.firstChange) {
      // if the list items change, update the context items (because they're not automatically updated)
      this.filterItems(this.inputVal, changes.listItems.currentValue);
      this.populateItemsMap(changes.listItems ? changes.listItems.currentValue : this.listItems);
    }

    if (
      changes.inputVal && !changes.inputVal.firstChange
    ) {
      // if the list items change, update the context items (because they're not automatically updated)
      this.filterItems(changes.inputVal.currentValue);
      this.populateItemsMap(changes.listItems ? changes.listItems.currentValue : this.listItems);
    }
  }


  /**
   * @author Ahsan Ayaz
   * @desc Updates the items property for the context provided to the dropdown template
   * @param items - the list of items to be assigned
   */

  filterItems(searchTerm = this.inputVal, items = this.listItems) {
    this.context.items = [...this.dropdownItemsFilter.transform(
      items,
      this.config,
      searchTerm
    )];
    this.ddIdPrefix = this.getRandomString();
  }

  private getRandomString() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  populateItemsMap(items, prefix = null) {
    if (prefix === null) {
      prefix = '';
    } else {
      prefix += this.identifierSeparator;
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
  }

  setNextActiveElement(currentActiveItem: AngularTagItem, items) {
    const identifier = currentActiveItem.tiIdentifier;
    if (!identifier) {
      items[0].tiKeyboardActive = true;
      this.keyboardEventsManager.setFirstItemActive();
      return;
    }
    const keyIdentifierArr = identifier.split(this.identifierSeparator);
    let keyIdentifier;
    let treeItems;
    let index;
    keyIdentifier = keyIdentifierArr.length > 1 ?
      [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1).join(this.identifierSeparator) :
      keyIdentifierArr[0];
    treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}${this.identifierSeparator}`).test(key));
    if (!treeItems.length) {
      treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}$`).test(key));
    }
    index = treeItems.findIndex(id => id === identifier);
    if (index === treeItems.length - 1) {
      this.setActiveElementRecursively(this.findNextParent(keyIdentifierArr), this.listItems);
    } else  {
      this.setActiveElementRecursively(treeItems[index + 1], this.listItems);
    }
  }

  findNextParent(keyIdentifierArr) {
    let keyIdentifier;
    let treeItems;
    if (keyIdentifierArr.length === 1) {
      const nextIdentifier = `${+keyIdentifierArr[0] + 1}`;
      if (this.itemsMap[nextIdentifier]) {
        return nextIdentifier;
      }
      return keyIdentifierArr[0];
    }
    const nextIdArr = [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1);
    nextIdArr[nextIdArr.length - 1] = `${(+nextIdArr[nextIdArr.length - 1]) + 1}`;
    keyIdentifier = nextIdArr.join(this.identifierSeparator);
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

    const keyIdentifierArr = identifier.split(this.identifierSeparator);
    let keyIdentifier;
    let treeItems;
    let index;
    keyIdentifier = keyIdentifierArr.length > 1 ?
      [...keyIdentifierArr].splice(0, keyIdentifierArr.length - 1).join(this.identifierSeparator) :
      keyIdentifierArr[0];
    treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}(${this.identifierSeparator})?`).test(key));
    if (!treeItems.length) {
      treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}$`).test(key));
    }
    index = treeItems.findIndex(id => id === identifier);
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
    keyIdentifier = prevIdArr.join(this.identifierSeparator);
    let treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}${this.identifierSeparator}`).test(key));
    if (!treeItems.length) {
      treeItems = Object.keys(this.itemsMap).filter(key => new RegExp(`^${keyIdentifier}$`).test(key));
    }
    if (treeItems.length) {
      if (treeItems.indexOf(prevItemIdentifier) !== -1) {
        return keyIdentifier;
      }
      return treeItems[treeItems.length - 1];
    } else if (keyIdentifierArr.length > 1) {
      return this.findPrevousParentLastChild([...keyIdentifierArr.splice(0, keyIdentifierArr.length - 1)], prevItemIdentifier);
    } else {
      keyIdentifier = keyIdentifierArr.join(this.identifierSeparator);
      return keyIdentifier;
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

  showTooltip(item: string, origin?: CdkOverlayOrigin) {
    this.tooltipForInput = item;
    this.inputTooltipOverlayOrigin = origin;
    this.tooltipTimeout = setTimeout(() => {
      this.inputTooltipShown = true;
    }, 500);
  }
  
  hideTooltip() {
    clearTimeout(this.tooltipTimeout);
    this.inputTooltipShown = false;
  }
}
