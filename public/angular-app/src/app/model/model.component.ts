import { Component, OnInit } from '@angular/core';
import { Model } from '../cars/cars.component';

import { CarDataService } from '../car-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {

  model!: Model;
  urlId! : string
  constructor(private carService: CarDataService, private route: ActivatedRoute) { 
    this.urlId = this.route.snapshot.params["carId"];
    this.model = new Model("","","");
  }

  ngOnInit(): void {
    const carId = this.route.snapshot.params["carId"];
    const modelId = this.route.snapshot.params["modelId"];
    this.carService.getCarModel(carId,modelId)
    .then(response => this._setModel(response))
    .catch(this._errorHandler);
  }

  private _errorHandler(error:any):void {
    console.log("Error while getting games");
    
  }

  private _setModel(model:Model): void {
    this.model = model;
  }

  public delete():void{
    console.log("delete");
    const carId = this.route.snapshot.params["carId"];
    const modelId = this.route.snapshot.params["modelId"];
    this.carService.deleteCarModel(carId, modelId)
                    .then(response=> {console.log(response)})
                    .catch(error=> {console.log(error)}); 
  }
}
