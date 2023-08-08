import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-mobile',
  templateUrl: './player-mobile.component.html',
  styleUrls: ['./player-mobile.component.scss']
})
export class PlayerMobileComponent {
  @Input() name: string = '';
  @Input() image: string = '1.webp';
  @Input() playerActive: boolean = false;
}
