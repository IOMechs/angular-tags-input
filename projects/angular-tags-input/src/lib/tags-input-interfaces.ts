export interface AngularTagsInputConfig {
  defaultClass?: string;
  additionalClasses?: string;
  placeholder?: string;
  displayProperty?: string;
  identifier?: string;
  onlyFromAutoComplete?: boolean;
  childrenCountProperty?: string;
  hideAddedTags?: boolean;
  nestedTagProperty?: string;
  showTagsSelectedInDD?: boolean;
  hideTags?: boolean;
  toggleSelectionOnClick?: boolean;
  nestedTagParentProp?: string;
  maxItems?: number;
  clearInputOnFocus?: boolean;
  clearTagsOnFocus?: boolean;
  hideInputOnSelection?: boolean;
  dropdownClass?: string;
  showParentTagsOnly?: boolean;
}

export interface AngularTagsInputDDFns {
  onItemAdded?(item: AngularTagItem): void;
  onItemClicked?(item: AngularTagItem): void;
}

export interface AngularTagItem {
  newTag?: boolean;
}
