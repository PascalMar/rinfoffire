import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  @Input() name: string = '';
  @Input() image: string = '1.webp';
  @Input() playerActive: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

}
