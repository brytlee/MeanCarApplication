import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { CarDataService } from '../car-data.service';

export class Car{
  #_id!: any;
  #name!:string;
  #year!:number;
  #country!:string;
  #model!:[Model];
  get _id() {return this.#_id}
  get name() {return this.#name}
  get year() {return this.#year}
  get country() {return this.#country}
  get model() {return this.#model}
  set name(name: string) {this.#name = name}
  set year(year: number) {this.#year = year}
  set country(country: string) {this.#country = country}

  constructor(id: any, name:string, year:number){
    this.#_id = id;
    this.#name= name;
    this.#year = year;
  }
}

export class Model{
  #_id!: any;
  #name!:string;
  #make!:string;
  get _id() {return this.#_id}
  get name() {return this.#name}
  get make() {return this.#make}
  set name(name: string) {this.#name = name}
  set make(make: string) {this.#make = make}

  constructor(id: string, name:string, make:string){
    this.#_id = id;
    this.#name= name;
    this.#make= make;
  }
}

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {

  searchText: string = ""
  cars:Car[] = [];
  newCar: Car = new Car("","",0);
  comName: string = "";
  country: string = "";
  constructor(private carService: CarDataService, private router: Router) { 
    carService.getCars(this.searchText).then(function(cars){
      console.log("Cars are", cars);
      
    });
  }

ngOnInit(): void {
    this.carService.getCars(this.searchText)
          .then(response => this._setCars(response))
          .catch(this._errorHandler);
    console.log("Running ngOnInit");
    
  }

  private _setCars(cars:Car[]): void {
    this.cars = cars;
  }

  public save(): void{
    this.carService.addCar(this.newCar)
    .then(response => console.log("Car added"))
    .catch(this._errorHandler);
    this.redirectTo("/cars");
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

  private _errorHandler(error:any):void {
    console.log("Error while getting cars");
    
  }

  search() {
    this.carService.getCars(this.searchText)
      .then(response => this._setCars(response))
      .catch(this._errorHandler);
  }
}
