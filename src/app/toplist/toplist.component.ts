import { Component, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Competition } from '../interfaces/Competition';
import { Observable, interval } from 'rxjs';
import { Score } from '../interfaces/Score';
import { CarouselComponent } from 'ngx-carousel-lib';
import { delay } from 'q';
import { BPClient } from 'blocking-proxy';
import { ThrowStmt } from '@angular/compiler';
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
  carouselSize: number;
  interval: any;
  changeCompetition(item) {
    console.log(item);
    this.currentCompetition = item;
  }
  ngOnInit() {

    if (screen.width < 576) { // 768px portrait
      this.mobile = true;
    }
    else this.mobile = false;
    // this.topCarousel.loop = true;
    // this.topCarousel.autoPlay = true;
    // this.topCarousel.delayAutoPlay = 1000;
    // this.topCarousel.autoPlayStart()

  }


  constructor(afs: AngularFirestore) {
    this.itemsDoc = afs.collection('competitions');
    this.items = this.itemsDoc.valueChanges();

  }
  @ViewChild('topCarousel', { static: false, }) topCarousel: CarouselComponent;

  prev() {
    // this.topCarousel.loop = true;
    // this.topCarousel.autoPlay = true;
    // this.topCarousel.delayAutoPlay = 1000;
    // this.topCarousel.autoPlayStart()
    this.carouselSize = this.topCarousel.carousel.totalItems;
    console.log(this.carouselSize);

    if (this.topCarousel.carousel.activeIndex == 0) {
      this.topCarousel.slideTo(this.carouselSize - 1);
    }
    else this.topCarousel.slidePrev();

  }

  next() {

    if (this.topCarousel.carousel.activeIndex + 1 == this.topCarousel.carousel.totalItems) {
      this.topCarousel.slideTo(0);
    }
    else this.topCarousel.slideNext();
  }
  start() {
  this.interval = setInterval(() => {
    if (this.topCarousel.carousel.activeIndex + 1 == this.topCarousel.carousel.totalItems) {
      this.topCarousel.slideTo(0);
    }
    else this.topCarousel.slideNext();
  }, 1000);
  }
  stop() {
    console.log('dziala');
    if (this.interval == undefined) {

      this.interval = setInterval(() => {
        if (this.topCarousel.carousel.activeIndex + 1 == this.topCarousel.carousel.totalItems) {
          this.topCarousel.slideTo(0);
        }
        else this.topCarousel.slideNext();
      }, 5000);
    } else {
      console.log(typeof (this.interval))
      clearInterval(this.interval)
      this.interval = undefined;
    }
  }

  getScreenWidth(event) {
    //var w = document.documentElement.clientWidth;
    var w = event.target.innerWidth;
    if (w < 576) { // 768px portrait
      this.mobile = true;
    }
    else this.mobile = false;
  }
}
