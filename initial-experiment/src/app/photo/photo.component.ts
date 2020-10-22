import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ObservableInputs } from '../library/library';

type PhotoComponentInputs = Pick<PhotoComponent, 'title'|'likes'|'capturedBy'>;

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() likes: number;
  @Input() capturedBy: string;

  private inputWatcher = new ObservableInputs<PhotoComponentInputs>(this, [
    'title',
    'likes',
    'capturedBy'
  ]);
  private inputs = this.inputWatcher.observables;

  constructor() { }

  ngOnInit(): void {
    this.inputs.title.subscribe(
      title => console.log('title changed!!!', title)
    );

    this.inputs.likes.subscribe(
      likes => console.log('likes changed!!!', likes)
    );

    this.inputs.capturedBy.subscribe(
      capturedBy => console.log('capturedBy changed!!!', capturedBy)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputWatcher.trackChanges(changes);
  }
}
