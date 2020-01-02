import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularTagsInputModule } from 'projects/angular-tags-input/src/public-api';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersDropdownTemplateComponent } from './users-dropdown-template/users-dropdown-template.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersDropdownTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularTagsInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
