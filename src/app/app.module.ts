import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";

import { FormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { CompetitionsComponent } from "./competitions/competitions.component";
import { AngularFireDatabaseModule } from "@angular/fire/database";

@NgModule({
  declarations: [AppComponent, CompetitionsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
