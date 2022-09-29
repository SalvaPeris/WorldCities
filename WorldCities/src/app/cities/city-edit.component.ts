import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { City } from './city';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.scss']
})

export class CityEditComponent implements OnInit {

  //The view Title
  title?: string;

  //The Form model
  form!: FormGroup;

  //City to edit
  city?: City;


  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  )
  { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });

    this.loadData();
  }

  loadData() {
    //retrieve the ID
    var idParam = this.activatedRouter.snapshot.paramMap.get('id');
    var id = idParam ? + idParam : 0;

    //fetch the city from the server
    var url = environment.baseUrl + 'api/Cities/' + id;
    this.http.get<City>(url).subscribe(result => {
      this.city = result;
      this.title = "Editar - " + this.city.name;

      //update the form with the city value
      this.form.patchValue(this.city);
    }, error => console.error(error));
  }

  onSubmit() {
    var city = this.city;

    if (city) {
      city.name = this.form.controls['name'].value;
      city.lat = +this.form.controls['lat'].value;
      city.lon = +this.form.controls['lon'].value;

      var url = environment.baseUrl + 'api/Cities/' + city?.id;

      this.http
        .put<City>(url, city)
        .subscribe(result => {
          console.log("Ciudad con id " + city!.id + " ha sido actualizado.")

          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
  }
}
