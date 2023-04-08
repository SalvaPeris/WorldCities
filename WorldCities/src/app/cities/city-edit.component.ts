import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { City } from './city';
import { Country } from './../countries/country';
import { BaseFormComponent } from '../base-form.component';
import { CityService } from './city.service';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})

export class CityEditComponent extends BaseFormComponent implements OnInit {

  //The view Title
  title?: string;

  //The Form model
  form!: FormGroup;

  //City to edit or create 
  city?: City;

  //It's NULL when we are creating a city
  id?: number;

  //Countries array
  countries?: Country[];

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  )
  {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]/)
      ]),
      lat: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]$/)
      ]),
      lon: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[1-9]$/)
      ]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());

    this.loadData();
  }

  loadData() {

    this.loadCountries();

    //retrieve the ID
    var idParam = this.activatedRouter.snapshot.paramMap.get('id');
    this.id = idParam ? + idParam : 0;

    if (this.id) {
      //fetch the city from the server
      this.cityService.get(this.id).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;

        // update the form with the city value
        this.form.patchValue(this.city);
      }, error => console.error(error));
    }
    else {
      //Adding city
      this.title = "Creando una nueva ciudad";
    }
  }

  loadCountries() {
    // fetch all the countries from the server
    this.cityService.getCountries(
      0,
      9999,
      "name",
      "asc",
      null,
      null,
    ).subscribe(result => {
      this.countries = result.data;
    }, error => console.error(error));
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } |
      null> => {
      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      var url = environment.baseUrl + 'api/Cities/IsDupeCity';

      return this.cityService.isDupeCity(city).pipe(map(result => {
        return (result ? { isDupeCity: true } : null);
      }));
    }
  }

  onSubmit() {
    var city = (this.id) ? this.city : <City>{};


    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;
      city.countryId = +this.form.controls['countryId'].value;

      if (this.id) {
        // EDIT mode
        this.cityService
          .put(city)
          .subscribe(result => {

            console.log("City " + city!.id + " has been updated.");

            this.router.navigate(['/cities']);
          }, error => console.error(error));
      }
      else {
        // ADD NEW mode
        this.cityService
          .post(city)
          .subscribe(result => {

            console.log("City " + result.id + " has been created.");

            this.router.navigate(['/cities']);
          }, error => console.error(error));
      }
    }
  }
}
