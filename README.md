# AngularTagsInput (@iomechs/angular-tags-input)

A simple tags input library for Angular. Supports nested elements and a lot of flexibility to the developers. (README to be updated)

## Installation

Install the package in your project's folder by using npm or yarn:

```bash
npm install @iomechs/angular-tags-input --save
# OR
yarn add @iomechs/angular-tags-input -S
```
## Getting Started

Import AngularTagsInputModule in your AppModule as below:

```typescript
import { AngularTagsInputModule } from '@iomechs/angular-tags-input';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularTagsInputModule, // <-- here
  ]
});
```

Then in your HTML, you can use as:

```html
<ti-angular-tags-input formControlName="locations" [tagsData]="(data$ | async)" (valueChanged)="onTagInputValueChange($event)" [config]="tagsInputConfig"> </ti-angular-tags-input>
```

## Input Properties

These are the available Input properties you can pass to the component.

| Input | Type  | Default | Description |
| ------ | ----- | -----| --------------- |
| `tagsData` | `any[]`   | `[]`   | List of items to be added in dropdown. Must be piped with async to pass an array. |
| `disabled`  | `boolean`  | `false`  | Disables the component interactions.  |
| `config` | [`AngularTagsInputConfig`](#angulartagsinputconfig) | (described in Interfaces section) | Component configuration (defined in [`AngularTagsInputConfig`](#angulartagsinputconfig) under [Configuration Interface](#configuration-interface)) |
| [`dropDownTemplate`](#dropdown-template-dropdowntemplate) | `TemplateRef<any>`  | Built-in template | Template used for rendering the dropdown content. |
| [`tagItemTemplate`](#tag-item-template-tagitemtemplate)| `TemplateRef<any>` | Built-in template | Template used for rendering the tag item in field.|

## Ouput Events

These events are emitted by the component and can be subscribed to using Angular event binding syntax.

| Output         | Payload Type | Description  |
| -------------- | ------------- | -----------| 
| `tagAdded`     | Tag item object (original data + internal metadata) | Emitted when a new tag is added     |
| `tagRemoved`   | Tag item object (original data + internal metadata) | Emitted when a tag is removed |
| `valueChanged` | `string` d| Emit the value typed in input field |
| `itemClicked`  | Tag item object (original data + internal metadata) | Emit when a tag is clicked.   |

> **Note**: The emitted item in `tagAdded`, `tagRemoved` and `itemClicked` includes all properties of your original data object, along with additional internal fields used by the library (e.g., tiSelected, tiIdentifier, etc.).

## Configuration Interface

### AngularTagsInputConfig

This interface defines all configurable options available for the tags input component.

| Option                   | Type      | Description                                                                                                                                                     |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`             | `string`  | Unique key used to identify each item in the provided `tagsData`.                                                                                               |
| `displayProperty`        | `string`  | Key in your `tagsData` whose value will be shown as the label for each dropdown option.                                                                         |
| `showTooltipOnOptions`   | `boolean` | Shows tooltip on hovering the dropdown options. Should be used together with `hoverProperty`.                                                                   |
| `hoverProperty`          | `string`  | The value that will be displayed as tooltip.                                                                                                                    |
| `showTagsSelectedInDD`   | `boolean` | Enable it if you want to show a check mark on selected items.                                                                                                   |
| `hideAddedTags`          | `boolean` | Enable it if you want to hide those tags that have already been selected in dropdown.                                                                           |
| `placeholder`            | `string`  | The placeholder value for input field.                                                                                                                          |
| `additionalClasses`      | `string`  | Additional classes to style input field.                                                                                                                        |
| `hideDDOnTagSelect`      | `boolean` | Enable it if you want to hide dropdown on every tag selection.                                                                                                  |
| `toggleSelectionOnClick` | `boolean` | Allows selecting/deselecting a dropdown item on click; clicking an already-selected item removes it instead of adding again.                                    |
| `clearInputOnFocus`      | `boolean` | Allows you to erase the text, when you focus on the input field.                                                                                                |
| `clearTagsOnFocus`       | `boolean` | Allows you to erase the tags, when you focus on the input field.                                                                                                |
| `ddHasBackdrop`          | `boolean` | Adds a backdrop overlay behind the dropdown                                                                                                                     |
| `hideDDOnBlur`           | `boolean` | Automatically hides the dropdown when the input field loses focus. Works only when ddHasBackdrop is disabled, because the backdrop prevents normal blur events. |
| `maxItems`               | `number`  | Specify the max number of tags that can be added inside input field.                                                                                            |
| `hideInputOnSelection`   | `boolean` | Allows you to insert only one tag, as the input field disappears on tag selection.                                                                              |
| `hideTags`               | `boolean` | Allows you to hide the selected tags from the input field.                                                                                                      |

If your data is nested, you may need to use these options as well.

| Option                  | Type      | Description                                                                                                                                                |
| ----------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `childrenCountProperty` | `number`  | Specifies the number of children an item have.                                                                                                             |
| `nestedTagProperty`     | `string`  | The key in your `tagsData` that have the list of child items.                                                                                              |
| `nestedTagParentProp`   | `string`  | Speicifies the identifer of parent.                                                                                                                        |
| `showParentTagsOnly`    | `boolean` | Enable it if you want to show only parent tag if all of its child tags are selected. Disable it if you want to show parent tags along with its child tags. |

## Custom Templates

The component allows you to fully customize the dropdown and tag appearance by passing your own Angular templates. If you don't pass `dropDownTemplate` or `tagItemTemplate`, the library would use its own default template.

### Dropdown Template (`dropDownTemplate`)

Example usages of `dropDownTemplate` are as follows:

#### Simple Dropdown Template

```html
<ng-template #simpleDDTemplate let-items="items" let-config="config" let-fns="fns">
  <div *ngIf="items.length" style="max-height: 250px; overflow-y: auto; padding-top: 8px;">
    <div *ngFor="let item of items">
      <div (click)="fns.onItemClicked(item)" style="display: flex; justify-content: space-between;">{{item[config.displayProperty]}}</div>
      <div *ngIf="item.tiSelected && config.showTagsSelectedInDD">
        <img src="assets/tick.png" alt="tick" width="14" />
      </div>
    </div>
  </div>
</ng-template>
```

> **Note**:
> Always remember to add `(click)="fns.onItemClicked(item)"`, otherwise neither the item will be added in input field nor any event would be emitted on clicking item.

> Don't forget to add `tick.png` in your assets folder.

#### Nested Dropdown Template

```html
<ng-template #nestedDDTemplate let-items="items" let-config="config" let-fns="fns">
  <div *ngIf="items.length" style="max-height: 250px; overflow-y: auto;padding-top: 8px;">
    <div *ngFor="let item of items">
      <div (click)="fns.onItemClicked(item)" style="display: flex; justify-content: space-between;">
        {{item[config.displayProperty]}}
        <div *ngIf="item.tiSelected && config.showTagsSelectedInDD">
          <img src="/assets/tick.png" alt="tick" width="14" />
        </div>
      </div>
      <ng-container *ngTemplateOutlet="ddNestedChildrenTemplate; context: {items: item[config.nestedTagProperty], config: config, fns: fns}"> </ng-container>
    </div>
  </div>
</ng-template>

<ng-template #nestedDDChildTemplate let-items="items" let-fns="fns" let-config="config">
  <div style="margin-left: 16px;">
    <ng-container *ngFor="let item of items">
      <div (click)="fns.onItemClicked(item, $event)">
        <div>
          <div>{{item[config.displayProperty]}}</div>
          <div *ngIf="item.tiSelected && config.showTagsSelectedInDD">
            <img src="../assets/tick.png" alt="tick" width="14" />
          </div>
        </div>
        <ng-container *ngTemplateOutlet="nestedDDChildTemplate; context: {items: item[config.nestedTagProperty], config: config, fns: fns}"> </ng-container>
      </div>
    </ng-container>
  </div>
</ng-template>
```

#### Dropdown Template with Tooltip

```html
<ng-template #simpleDDWithTooltip let-items="items" let-config="config" let-fns="fns">
  <div *ngIf="items.length" style="max-height: 250px; overflow-y: auto;padding-top: 8px;">
    <div *ngFor="let item of items">
      <div (click)="fns.onItemClicked(item)" style="display: flex; justify-content: space-between;" cdkOverlayOrigin #onHoverTrigger="cdkOverlayOrigin" (mouseenter)="fns.showTooltip(item[config.hoverProperty], onHoverTrigger)" (mouseleave)="fns.hideTooltip()">
        {{item[config.displayProperty]}}
        <div *ngIf="item.tiSelected && config.showTagsSelectedInDD">
          <img src="/assets/tick.png" alt="tick" width="14" />
        </div>
      </div>
    </div>
  </div>
</ng-template>
```
### Tag Item Template (`tagItemTemplate`)
Example usage of `tagItemTemplate` is as follows
```html
<ng-template
  #customTag
  let-item="item"
  let-config="config"
  let-closeClicked="closeClicked"
>
<div
  *ngIf="item"
  style="padding: 10px; background-color: black; color: white; display: flex; gap:8px; align-items: center; border-radius: 4px; margin-right: 4px;"
>
  <div>
    {{ item[config.displayProperty] }}
  </div>
  <button (click)="closeClicked.emit(item)"
    style="background: none; border: none; color: white; cursor: pointer; padding: 2px;">
    x
  </button>
</div>
</ng-template>  
```
> Notice the `(click)="closeClicked.emit(item)"`. If you don't include this in button tag, then the tag won't be removed from input field upon clicking on cross button and you will have to remove the item by clicking on option from dropdown.
>
> If you don't want the cross button functionality, you can simply remove the `button` tag.


## Compatibility

All released versions of this library (up to tag `0.1.16`) are compatible with Angular `^8.2.11`.

Use `1.x.x` for Angular `^15.x.x`
