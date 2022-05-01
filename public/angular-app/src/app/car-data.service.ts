import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Car } from './cars/cars.component';
import { Model } from './cars/cars.component';

@Injectable({
  providedIn: 'root'
})
export class CarDataService {

  private baseUrl:string = "http://localhost:3000/api/";

  constructor(private http: HttpClient) { }

  getCars(searchText?: string): Promise<Car[]>{
    let params;

    if (searchText) {
      params = new HttpParams();
      params = params.append("name", searchText)
    }
    let url: string =  this.baseUrl + "cars";

    console.log(url);
    return this.http.get(url,{ params: params }).toPromise()
            .then(response => response as Car[])
            .catch(this._handleError);
  }

  getCar(id: string): Promise<Car> {
    const url: string =  this.baseUrl + "cars/" + id;
    return this.http.get(url).toPromise()
            .then(response => response as Car)
            .catch(this._handleError);
  }

  addCar(car: Car): Promise<Car> {
    const url: string =  this.baseUrl + "cars";
    console.log(car);
    return this.http.post(url, {name: car.name, year: car.year, country: car.country}).toPromise()
            .then(response => response as Car)
            .catch(this._handleError);
  }

  deleteCar(carId: string): Promise<Car> {
    const url: string = this.baseUrl + "cars/" + carId;
    return this.http.delete(url).toPromise()
                    .then(response => console.log("car deleted"))
                    .catch(this._handleError);
  }

  addCarModel(model: Model, carId: string): Promise<Car> {
    const url: string =  this.baseUrl + "cars/" + carId + "/models";
    console.log(model);
    return this.http.post(url, {name: model.name, make: model.make}).toPromise()
            .then(response => response as Model)
            .catch(this._handleError);
  }

  getCarModel(carId: string, modelId: string): Promise<Model>{
    const url: string =  this.baseUrl + "cars/" + carId + "/models/" + modelId;
    return this.http.get(url).toPromise()
            .then(response => response as Model)
            .catch(this._handleError);
  }

  deleteCarModel(carId: string, modelId: string): Promise<Car> {
    const url: string = this.baseUrl + "cars/" + carId + "/models/" + modelId;
    return this.http.delete(url).toPromise()
                    .then(response => console.log("car model deleted"))
                    .catch(this._handleError);
  }

  private _handleError(err: any): Promise<any>{
    console.log("Service Error", err);
    return Promise.reject(err.message || err);
  }
}
