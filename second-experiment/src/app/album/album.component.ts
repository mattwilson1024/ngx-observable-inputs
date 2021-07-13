import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { PhotoModule } from '../photo/photo.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  public photo1Likes = 0;
  public photo2Likes = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public onLike1(): void {
    this.photo1Likes++;
  }

  public onLike2(): void {
    this.photo2Likes++;
  }
}

@NgModule({
  declarations: [AlbumComponent],
  imports: [
    CommonModule,
    PhotoModule
  ],
  exports: [AlbumComponent],
})
export class AlbumModule { }
