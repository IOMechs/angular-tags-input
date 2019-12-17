import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AngularTagsInputService } from './angular-tags-input.service';
import { TagInputComponent } from './tag-input/tag-input.component';
import { AngularTagItem, AngularTagsInputConfig } from './tags-input-interfaces';
import { UnAddedTagsPipe } from './un-added-tags.pipe';
import { DropdownComponent } from './dropdown/dropdown.component';
import { KEY_CODES } from './constants';

@Component({
  selector: 'ti-angular-tags-input',
  templateUrl: './angular-tags-input.component.html',
  styleUrls: ['./angular-tags-input.component.scss'],
  providers: [
    getAngularTagsInputValueAccessor()
  ],
  encapsulation: ViewEncapsulation.None
})
export class AngularTagsInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges {
  @ViewChild(DropdownComponent, { static: false }) dropdown: DropdownComponent;
  @Input() config: AngularTagsInputConfig;
  @Input() tagsData: Array<any> = [];
  @Input() tagsLoading: boolean;
  @Input() dropDownTemplate: TemplateRef<any> = null;
  @Input() tagItemTemplate: TemplateRef<any> = null;
  @Output() tagRemoved = new EventEmitter();
  @Output() tagAdded = new EventEmitter();
  @Output() valueChanged = new EventEmitter();
  @Output() itemClicked = new EventEmitter();
  @ViewChild(TagInputComponent, { static: true }) tagInput: TagInputComponent;
  tags: Array<AngularTagItem> = [];
  isInputFocused: boolean;
  defaultConfig: AngularTagsInputConfig = {
    defaultClass: 'angular-tags-input',
    additionalClasses: '',
    displayProperty: 'value',
    identifier: 'id',
    onlyFromAutoComplete: false,
    placeholder: 'Search',
    hideAddedTags: true,
    nestedTagProperty: '',
    showTagsSelectedInDD: false,
    hideTags: false,
    maxItems: null,
    nestedTagParentProp: ''
  };
  onChange: (items: AngularTagItem[]) => void;
  inputDisabled: boolean;
  dropdownOverlayPosition = [
    { offsetY: 28, originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { offsetY: -28, originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { offsetY: 28, originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'bottom' },
    { offsetY: -28, originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
  ];
  ddScrollStrategy: ScrollStrategy;
  isDropdownOpen: boolean;
  dropdownShownYet: boolean;
  unAddedTagsPipe = new UnAddedTagsPipe();
  constructor(
    private readonly sso: ScrollStrategyOptions,
    private tagsService: AngularTagsInputService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    // if there's no change in the tagsData, do nothing
    if (!changes.tagsData || !this.isInputFocused) {
      return;
    }

    // If the previous walue was `null` or `undefined`, we're initializing that as an array here
    // so we can avoid breaking the process further.
    if (!changes.tagsData.previousValue) {
      changes.tagsData.previousValue = [];
    }
    // if we have the value of the tags changed, we need to show the dropdown immediately
    // we don't show this on the first change, because that's when the first value is assigned
    if (
      changes.tagsData && changes.tagsData.currentValue !== changes.tagsData.previousValue
      && !changes.tagsData.firstChange
    ) {
      // if the values don't match, show the dropdown
      if (changes.tagsData.currentValue.length !== changes.tagsData.previousValue.length && !!this.dropdownShownYet) {
        return this.showDropdown(changes.tagsData.currentValue);
      }

      if (changes.tagsData.previousValue.length === 0) {
        return;
      }

      /* since the values are array, we need to compare the elements within
       * avoiding the usage of any external library, matching the elements using identifier
       * of the elements here
       */
      for (let i = 0, len = changes.tagsData.currentValue.length; i < len; ++i) {
        if (changes.tagsData.currentValue[i][this.config.identifier] !== changes.tagsData.previousValue[i][this.config.identifier]) {
          // as soon as the difference in elements is found, show the element and stop further execution of for loop
          return this.showDropdown(changes.tagsData.currentValue);
        }
      }
    }
  }

  onFocusChange(val: boolean) {
    this.isInputFocused = val;
    if (!val && this.config.hideDDOnBlur) {
      this.hideDropdown();
    }
  }

  ngOnInit() {
    this.config = { // applying the configuration provided
      ...this.defaultConfig,
      ...this.config
    };
    this.ddScrollStrategy = this.sso.reposition();
  }

  /**
   * @author Ahsan Ayaz
   * @desc Triggers when the value of the form control (or ngModel) is changed.
   * We're using the handler to assign the values to the tags array that we have.
   */
  writeValue(tags: Array<any>): void {
    tags = tags ? tags : [];
    tags = Array.isArray(tags) ? tags : [tags];
    this.tags = tags.map((tag) => {
      return {
        ...tag,
        ...{
          [this.config.identifier]: tag[this.config.identifier],
          [this.config.displayProperty]: tag[this.config.displayProperty],
        }
      };
    });

    if (this.config.showTagsSelectedInDD) {
      setTimeout(() => {
        this.tags.map((tag) => {
          this.selectRelatedTags(tag);
        });
      });
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Registers the on change function to the value accessor
   */
  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  /**
   * @author Ahsan Ayaz
   * @desc Triggers when the tag input is focused
   */
  onInputFocus() {
    if (this.config.clearInputOnFocus) {
      if (this.tagInput.lastValueEmitted !== '') {
        this.tagInput.tagInputForm.get('tagInputVal').setValue('');
      }
      this.tagInput.resetInput();
    }
    if (this.config.clearTagsOnFocus) {
      this.tags.length = 0;
    }
    this.showDropdown();
    this.onFocusChange(true);
  }

  /**
   * @author Ahsan Ayaz
   * @desc Shows the dropdown with options listing
   */
  showDropdown(recentTags: Array<any> = null) {
    const unAddedTags = this.unAddedTagsPipe.transform(
      !!recentTags ? recentTags : this.tagsData,
      {
        tagsAdded: this.tags,
        config: this.config
      }
    );
    if (unAddedTags.length) { // only show dropdown when we have data to show
      this.isDropdownOpen = true;
    }
    if (!this.dropdownShownYet) {
      this.dropdownShownYet = true;
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Hides the options listing dropdown
   */
  hideDropdown() {
    this.isDropdownOpen = false;
    this.tagsData = this.removeKeyboardSelection(this.tagsData);
  }

  removeKeyboardSelection(items: Array<AngularTagItem>) {
    return items.map((tag: AngularTagItem) => {
      if (tag[this.config.nestedTagProperty] && tag[this.config.nestedTagProperty].length) {
        tag[this.config.nestedTagProperty] = this.removeKeyboardSelection(tag[this.config.nestedTagProperty]);
      }
      return {
        ...tag,
        tiKeyboardActive: false
      };
    });
  }

  ngAfterViewInit() {
    if (!!this.config || !this.onChange) {
      console.warn('Please use ngModel or FormControlName with <ti-angular-tags-input>');
    }
    if (this.config.nestedTagProperty) {
      // we need the parent property to be able to unselect the parent when a child tag is unselected
      if (!this.config.nestedTagParentProp) {
        // tslint:disable-next-line:max-line-length
        throw new Error('nestedTagProperty provided but nestedTagParentProp not provided.\nThis will cause the parent tag to not remove if any of the children is removed');
      }
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Adds the tag in the tags list (tags array).
   * Avoids duplicate tags addition
   * @param tag - tag to add
   */
  addTag(tag: AngularTagItem) {
    tag.tiSelected = true; // marks the element as selected
    if (this.config.maxItems > 0 && this.tags.length === this.config.maxItems) {
      return;
    }
    if (!this.tags.find(tagItem => tagItem[this.config.identifier] === tag[this.config.identifier])) {
      this.tags = [...this.tags, tag];
      this.onChange(
        this.tags
      );
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Removes the tags from the tags list
   * @param tag - tag to remove
   */
  removeTag(tag: AngularTagItem, ignoreChildren = false, ignoreParent = false) {
    this.tags = this.tags.filter((tagItem) => tagItem[this.config.identifier] !== tag[this.config.identifier]);
    // when we've removed all the tags, we want to get the default tags
    if (this.tags.length === 0) {
      this.tagInput.resetInput();
      this.valueChanged.emit('');
    }
    this.onChange(
      this.tags
    );
  }

  /**
   * @author Ahsan Ayaz
   * @desc Triggers when the item is clicked from the dropdown
   * @param tag - tag selected
   */
  onItemClicked(tag: AngularTagItem) {
    // if we don't have to toggle, add the item as tag right away
    if (this.config.toggleSelectionOnClick) {
      // we have to toggle selection. First, let's see if the tag doesn't exist already in the selected tags
      if (!tag.tiSelected && !this.tags.find(tagItem => tagItem[this.config.identifier] === tag[this.config.identifier])) {
        this.addTag(tag);
        this.selectRelatedTags(tag);
      } else {  // if the tag is already selected, remove
        this.removeTag(tag);
        this.tagRemoved.emit(tag);
        this.removeTagSelection(tag);
      }
    } else {
      this.addTag(tag);
      this.selectRelatedTags(tag);
    }
    this.tagInput.resetInput();
    this.itemClicked.emit(tag);
    this.hideDropdown();
    this.tagAdded.emit(
      this.tagsService.getMainTagAfterAdding(
        this.tagsData,
        tag,
        this.tags,
        this.config
      )
    );
  }

  /**
   * @author Ahsan Ayaz
   * @desc Removes the tag seleced state (and of the children)
   * @param tag - the tag to unmark as selected
   */
  removeTagSelection(tag: AngularTagItem, ignoreChildren = false, ignoreParent = false) {
    tag.tiSelected = false;
    if (!ignoreChildren && tag[this.config.nestedTagProperty]) {
      for (let i = 0, len = tag[this.config.nestedTagProperty].length; i < len; ++i) {
        this.removeTag(tag[this.config.nestedTagProperty][i], ignoreChildren, true);
        this.removeTagSelection(tag[this.config.nestedTagProperty][i], ignoreChildren);
      }
    }
    if (tag[this.config.nestedTagParentProp] && !ignoreParent) {
      const parentTag = this.tagsService.findTagById(
        this.tagsData,
        tag[this.config.nestedTagParentProp],
        this.config
      );
      if (parentTag && parentTag.tiSelected) {
        this.removeTag(parentTag, true, ignoreParent);
        this.removeTagSelection(parentTag, true, ignoreParent);
        parentTag[this.config.nestedTagProperty].map((tagItem) => {
          // tslint:disable-next-line:triple-equals
          if (tagItem[this.config.identifier] != tag[this.config.identifier]) {
            this.addTag(tagItem);
            this.selectRelatedTags(tagItem, false, true);
          }
        });
      }
    }
    this.onChange(
      this.tags
    );
  }

  /**
   * @author Ahsan Ayaz
   * @desc triggers on close button click of the tags
   * @param tag - the tag to remove
   */
  tagCloseClicked(tag) {
    this.tagRemoved.emit(tag);
    this.removeTag(tag);
    this.removeTagSelection(tag);
  }

  /**
   * @author Ahsan Ayaz
   * @desc Selects/adds the retated tags (parent and/or children)
   * @param tag - the tag to mark as selected
   */
  selectRelatedTags(tag: AngularTagItem, ignoreChildren = false, ignoreParent = false) {
    tag.tiSelected = true;
    if (tag[this.config.nestedTagProperty] && !ignoreChildren) {
      for (let i = 0, len = tag[this.config.nestedTagProperty].length; i < len; ++i) {
        if (this.config.showParentTagsOnly) {
          // remove the children if we only have to keep parent
          this.removeTag(tag[this.config.nestedTagProperty][i], false, true);
          // making sure we're targeting only children, ignoring parents
          this.selectRelatedTags(tag[this.config.nestedTagProperty][i], false, true);
        } else {
          this.addTag(tag[this.config.nestedTagProperty][i]);
        }
      }
    }
    if (tag[this.config.nestedTagParentProp] && !ignoreParent) {
      const parentTag = this.tagsService.findTagById(
        this.tagsData,
        tag[this.config.nestedTagParentProp],
        this.config
      );
      if (!parentTag) {
        return;
      }
      const parentTagChildren = parentTag[this.config.nestedTagProperty].length;
      const childrensSelected = this.tags.filter((tagItem) => {
        // tslint:disable-next-line:triple-equals
        return tagItem[this.config.nestedTagParentProp] == parentTag[this.config.identifier];
      }).length;
      if (
        ( parentTagChildren > 0 && childrensSelected > 0 ) &&
        (this.config.childrenCountProperty ?
          childrensSelected === parentTag[this.config.childrenCountProperty] :
          childrensSelected === parentTagChildren
        )
      ) {
        this.addTag(parentTag);
        this.selectRelatedTags(parentTag, false, false);
      }
    }
    this.onChange(
      this.tags
    );
  }

  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  /**
   * @author Ahsan Ayaz
   * @desc Sets the disabled state for the tags input
   */
  setDisabledState?(isDisabled: boolean): void {
    this.inputDisabled = isDisabled;
  }

  inputKeyPress($event) {
    if (
      !this.isDropdownOpen &&
      (
        $event.key === KEY_CODES.ARROW_UP ||
        $event.key === KEY_CODES.ARROW_DOWN
      )
    ) {
      this.isDropdownOpen = true;
    }
    // so we have the dropdown shown
    setTimeout(() => {
      this.dropdown.handleKeyUp($event);
    }, 0);
  }

}


export function getAngularTagsInputValueAccessor() {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AngularTagsInputComponent),
    multi: true,
  };
}
