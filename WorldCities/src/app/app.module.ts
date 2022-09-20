import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

import { AppRoutingModule } from './app-routing.module';

import { AngularMaterialModule } from './angular-material.module';

import { CitiesComponent } from './cities/cities.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavMenuComponent,
    CitiesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
