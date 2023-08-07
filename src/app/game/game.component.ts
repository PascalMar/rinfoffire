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
        this.game.currentCard = firestoreGame.currentCard;
        this.game.pickCardAnimation = firestoreGame.pickCardAnimation;        
      }
    })
  }

  async newGame() {
    this.game = new Game();
  }


  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || '';
      this.game.pickCardAnimation = true;
    


      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.updateDrawRelatedState();
      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard);        
        this.game.pickCardAnimation = false;
        this.updateDrawRelatedState();
      }, 1000);
      console.log('current card is:', this.game.currentCard);
      
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.savePlayer();
      }
    });
  }

  savePlayer() {
    if (this.gameID) {
      const gameDocRef = doc(this.coll, this.gameID);    // Falsches Verständnis von der "gameDocRef" - updateDoc hat nicht in "game" aktualisiert, sondern ein neues Array angelegt
      updateDoc(gameDocRef, {
        "game.players": arrayUnion(...this.game.players)
      });
    }
  }



  updateDrawRelatedState() {
    if (this.gameID) {
      const gameDocRef = doc(this.coll, this.gameID);
      updateDoc(gameDocRef, {
        "game.currentCard": this.game.currentCard,
        "game.pickCardAnimation": this.game.pickCardAnimation,
        "game.stack": this.game.stack,
        "game.playedCard": this.game.playedCard,
        "game.currentPlayer": this.game.currentPlayer
      });
    }
  }
}
