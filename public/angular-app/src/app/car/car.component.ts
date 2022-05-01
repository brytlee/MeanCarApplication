import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


import { CarDataService } from '../car-data.service';
import { Car, Model } from '../cars/cars.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  car!: Car;
  newModel!: Model
  id!: string;
  constructor(private route: ActivatedRoute, private carService: CarDataService, private router : Router) {
    this.car = new Car("","",0);
    this.newModel = new Model("","","");
   }

  ngOnInit(): void {
    const carId = this.route.snapshot.params["carId"];
    this.carService.getCar(carId)
        .then(response => {this.car = response})
        .catch(error => {console.log("Error getting car", error);
        });
  }

  public delete():void{
    console.log("delete");
    const carId = this.route.snapshot.params["carId"];
    this.carService.deleteCar(carId)
                    .then(response=> {console.log(response)})
                    .catch(error=> {console.log(error)}); 
  }

  public save(): void{
    const carId = this.route.snapshot.params["carId"];
    this.carService.addCarModel(this.newModel, carId)
    .then(response => console.log("Model added"))
    .catch(this._errorHandler);

    this.redirectTo("/cars/" + carId);
  }

  private _errorHandler(error:any):void {
    console.log("Error while getting games");
    
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

}
