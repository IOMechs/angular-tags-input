# AngularTagsInput (@iomechs/angular-tags-input)

A simple tags input library for Angular. Supports nested elements and a lot of flexibility to the developers. (README to be updated)

## Usage

Install the package in your project's folder by using npm or yarn:
```bash
npm install @iomechs/angular-tags-input --save
# OR
yarn add @iomechs/angular-tags-input -S
```

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
  <ti-angular-tags-input
    formControlName="locations" [tagsData]="(data$ | async)"
    (valueChanged)="onTagInputValueChange($event)"
    [config]="tagsInputConfig">
  </ti-angular-tags-input>
```
