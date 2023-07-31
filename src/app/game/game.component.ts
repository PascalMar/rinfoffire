import { Component, OnInit, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, collectionData, doc, updateDoc, arrayUnion, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: Game = new Game();
  gameID: string = '';


  firestore: Firestore = inject(Firestore)
  items$: Observable<any[]>;
  coll: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.coll = collection(this.firestore, 'games')
    this.items$ = collectionData(this.coll);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameID = params['id'];
    });
    onSnapshot(doc(this.coll, this.gameID), (doc) => {
      const firestoreData = doc.data()
      if (firestoreData) {
        const firestoreGame = firestoreData['game'];
        this.game.currentPlayer = firestoreGame.currentPlayer;
        this.game.playedCard = firestoreGame.playedCard;
        this.game.players = firestoreGame.players;
        this.game.stack = firestoreGame.stack;
      }
    })
  }

  async newGame() {
    this.game = new Game();
  }


  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || '';
      this.pickCardAnimation = true;


      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    if (this.gameID) {
      const gameDocRef = doc(this.coll, this.gameID);    // Falsches Verständnis von der "gameDocRef" - updateDoc hat nicht in "game" aktualisiert, sondern ein neues Array angelegt
      updateDoc(gameDocRef, {
        "game.players": arrayUnion(...this.game.players)
      });
    }
  }
}
