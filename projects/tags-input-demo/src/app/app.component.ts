import { Component } from "@angular/core";
import {
  AngularTagsInputConfig,
  AngularTagsInputService,
} from "angular-tags-input"; // Use mapped path
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { TAGS_DATA_NESTED, TAGS_DATA_SIMPLE, TAGS_DATA_IMAGES } from "./data";
import { of } from "rxjs/internal/observable/of";

@Component({
  selector: "tid-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  simpleForm: UntypedFormGroup;
  title = "tags-input-demo";
  sampleDataNested$ = of(TAGS_DATA_NESTED);
  sampleDataSimple$ = of(TAGS_DATA_SIMPLE);
  sampleDataImage$ = of(TAGS_DATA_IMAGES);

  nestedTagsInputConfig1: AngularTagsInputConfig = {
    showTagsSelectedInDD: false,
    hideAddedTags: false,
    childrenCountProperty: "subOrdinatesCount",
    hideDDOnBlur: true,
    nestedTagProperty: "subOrdinates",
    onlyFromAutoComplete: true,
    additionalClasses: "ti-tags-input",
    displayProperty: "name",
    identifier: "id",
    placeholder: "Search", // only for those inputs having options
    toggleSelectionOnClick: true,
    nestedTagParentProp: "parentId",
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: false,
    showTooltipOnOptions: true,
    ddHasBackdrop: true, // to close on click outside dropdown
    hideDDOnTagSelect: true,
  };

  nestedTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    childrenCountProperty: "subOrdinatesCount",
    hideDDOnBlur: false,
    nestedTagProperty: "subOrdinates",
    onlyFromAutoComplete: true,
    additionalClasses: "ti-tags-input",
    placeholder: "Search",
    displayProperty: "name",
    identifier: "id",
    toggleSelectionOnClick: true,
    nestedTagParentProp: "parentId",
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: false,
    ddHasBackdrop: true,
    hideDDOnTagSelect: true, // to close on selecting a tag
  };

  simpleTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: true,
    hideDDOnBlur: true,
    nestedTagProperty: "subOrdinates",
    onlyFromAutoComplete: true,
    additionalClasses: "ti-tags-input",
    displayProperty: "full_name",
    identifier: "Id",
    toggleSelectionOnClick: true,
    nestedTagParentProp: "parent_id",
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: false,
    ddHasBackdrop: true,
    hideDDOnTagSelect: true,
  };

  simpleTagsInputConfig2: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    hideDDOnBlur: true,
    placeholder: "Search",
    nestedTagProperty: "subOrdinates",
    onlyFromAutoComplete: true,
    additionalClasses: "ti-tags-input",
    displayProperty: "full_name",
    hoverProperty: "description",
    identifier: "Id",
    toggleSelectionOnClick: true,
    nestedTagParentProp: "parent_id",
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: false,
    ddHasBackdrop: true,
    showTooltipOnOptions: true,
    hideDDOnTagSelect: true,
  };

  imageTagsInputConfig: AngularTagsInputConfig = {
    showTagsSelectedInDD: true,
    hideAddedTags: false,
    hideDDOnBlur: true,
    onlyFromAutoComplete: true,
    additionalClasses: "ti-tags-input",
    displayProperty: "full_name",
    identifier: "Id",
    clearInputOnFocus: true,
    showParentTagsOnly: true,
    hideTags: false,
    ddHasBackdrop: true,
    hideDDOnTagSelect: true,
  };

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly tagsInputService: AngularTagsInputService
  ) {
    this.simpleForm = this.fb.group({
      simpleData: [[], []],
      nestedData: [[], []],
      nestedData1: [[], []],
      imageData: [[], []],
    });
    this.tagsInputService.setDebugMode(true);
  }

  onValChanged($event) {}

  onTagAdded($event) {
    console.log(this.simpleForm.value);
  }

  changeConfigOption(event: any, option) {
    this.simpleTagsInputConfig2 = {
      ...this.simpleTagsInputConfig2,
      [option]: event.target.checked,
    };
  }

  changeNestedConfigOption(event: any, option) {
    this.nestedTagsInputConfig = {
      ...this.nestedTagsInputConfig,
      [option]: event.target.checked,
    };
  }
}
