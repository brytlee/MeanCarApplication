import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { CarComponent } from './car/car.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FooterComponent } from './footer/footer.component';
import { CarsComponent } from './cars/cars.component';
import { ModelComponent } from './model/model.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    CarComponent,
    ErrorPageComponent,
    FooterComponent,
    CarsComponent,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent,
        runGuardsAndResolvers: "always"
      },
      {
        path: "cars",
        component: CarsComponent,
        runGuardsAndResolvers: "always"
      },
      {
        path: "cars/:carId",
        component: CarComponent,
        runGuardsAndResolvers: "always"
      },
      {
        path: "cars/:carId/models/:modelId",
        component: ModelComponent,
        runGuardsAndResolvers: "always"
      },
      {
        path: "**",
        component: ErrorPageComponent,
        runGuardsAndResolvers: "always"
      }
    ],{
      onSameUrlNavigation: 'reload'
    }),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
