import { Component, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Observable } from 'rxjs';
import { Score } from '../interfaces/Score';
import { CarouselComponent } from 'ngx-carousel-lib';
import { delay } from 'q';
@Component({
  selector: 'app-toplist',
  templateUrl: './toplist.component.html',
  styleUrls: ['./toplist.component.css']
})
export class TopListComponent implements OnInit {
  title = 'toplist';
  private itemsDoc: AngularFirestoreCollection<Competition>;
  items: Observable<Competition[]>;
  currentCompetition: any;
  _comp: Competition;
  afs: AngularFirestore;
  results: any;
  closeResult: string;
  currentItem: Score;
  mobile: Boolean;
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
  ngOnInit() { 
  
    if (screen.width < 576) { // 768px portrait
      this.mobile = true;
    }
    else this.mobile= false;
    this.topCarousel.loop = true;
    this.topCarousel.autoPlay = true;
    this.topCarousel.delayAutoPlay = 1000;
    this.topCarousel.autoPlayStart()
  }


  constructor(afs: AngularFirestore) {
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();
    
  }
  @ViewChild('topCarousel' ,{static: false,}) topCarousel: CarouselComponent;
  
  prev() {
    // this.topCarousel.loop = true;
    // this.topCarousel.autoPlay = true;
    // this.topCarousel.delayAutoPlay = 1000;
    // this.topCarousel.autoPlayStart()
   
    this.topCarousel.slidePrev();
  }
  next() {
    this.topCarousel.slideNext();
    
  }
  // async delay(ms: number) {
  //   await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  // }
  // async first() {
  //   console.log("check")
  //   await delay(1000);
  //   this.topCarousel.slideTo(0);
  // }
  first() {
      
  }

  getScreenWidth(event) {
    //var w = document.documentElement.clientWidth;
    var w = event.target.innerWidth;
    if (w < 576) { // 768px portrait
      this.mobile = true;
    }
    else this.mobile= false;
  }
}
