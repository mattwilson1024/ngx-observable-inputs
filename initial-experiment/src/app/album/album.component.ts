import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {
  public likes = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public onLike(): void {
    this.likes++;
  }

}
