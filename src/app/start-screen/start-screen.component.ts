import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore)
  items$: Observable<any[]>;
  coll: any;
  game: Game = new Game();

  constructor(private router: Router) {
    this.coll = collection(this.firestore, 'games')
    this.items$ = collectionData(this.coll);
  }


  async newGame() {
    let game = new Game();
    const docRef = await addDoc(this.coll, { game: game.toJson() });
    this.router.navigate(['game', docRef.id]);
    console.log(game);
  }
}
