import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CompetitionsComponent } from './competitions/competitions.component';
import { CompetitionComponent } from './competition/competition.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LadderComponent } from './ladder/ladder.component';
import { FooterComponent } from './footer/footer.component';
import { TopListComponent } from './toplist/toplist.component';
import { ResultsComponent } from './results/results.component';
import { PlayerResultComponent } from './player-result/player-result.component';
import { AdminComponent } from './admin/admin.component';
import { CarouselModule } from "ngx-carousel-lib";
const appRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
  {
    path: '',
    component: TopListComponent
  },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ResultsComponent,
    PlayerResultComponent,
    CompetitionsComponent,
    CompetitionComponent,
    FooterComponent,
    TopListComponent,
    LadderComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }, // <-- debugging purposes only
    ),
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
