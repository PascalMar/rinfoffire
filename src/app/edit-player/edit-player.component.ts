import { Component } from '@angular/core';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  public dialogRef: MatDialogRef<DialogAddPlayerComponent> = {} as MatDialogRef<DialogAddPlayerComponent>;
  allProfilePictures = ['2.png', '1.webp', 'monkey.png', 'pinguin.svg'];

}
