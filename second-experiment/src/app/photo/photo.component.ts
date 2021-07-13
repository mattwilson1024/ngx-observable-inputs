import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ObserveInput, PossibleInputKeys } from '../library/observable-inputs';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() caption: string;
  @Input() likes: number;

  @ObserveInput<PhotoComponent>('caption') caption$: Observable<string>;
  @ObserveInput<PhotoComponent>('likes') likes$: Observable<number>;

  constructor() { }

  ngOnInit(): void {
    this.caption$.subscribe(
      newVal => console.log('omg! caption changed', newVal)
    );

    this.likes$.subscribe(
      newVal => console.log('omg! likes changed', newVal)
    );
  }

}

@NgModule({
  declarations: [PhotoComponent],
  imports: [
    CommonModule,
  ],
  exports: [PhotoComponent],
})
export class PhotoModule { }
