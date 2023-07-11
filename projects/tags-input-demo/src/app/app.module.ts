import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularTagsInputModule } from 'projects/angular-tags-input/src/public-api';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersListItemComponent } from './users-list-item/users-list-item.component';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    AppComponent,
    UsersListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularTagsInputModule,
    ReactiveFormsModule,
    OverlayModule
  ],
  exports: [OverlayModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
