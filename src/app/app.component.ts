import { Component, HostListener, OnInit } from '@angular/core';
import { WORDS } from './data/normals.words';
import { Board } from './models/board.component';
import { Row } from './models/row.component';
import { Square } from './models/square.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public board = new Board();
  public secretWord = '';
  public currentGuessRow = 0;
  public currentGuessSquare = 0;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code.includes('Key')) {
      this.KeyPressed(event.key);
    } else if (event.code === 'Backspace') {
      this.Backspace();
    } else if (event.code === 'Enter') {
      this.GuessWord();
    }
  }

  public ngOnInit(): void {
    this.InitBoard();
  }

  public InitBoard(): void {
    for (let i = 0; i < 6; i++) {
      const row = new Row();
      for (let j = 0; j < 5; j++) {
        const square = new Square();
        row.squares.push(square);
      }

      this.board.rows.push(row);
    }
    this.secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  private KeyPressed(key: string): void {
    if (
      this.board.rows[this.currentGuessRow].squares[this.currentGuessSquare]
        .content === ''
    ) {
      this.board.rows[this.currentGuessRow].squares[
        this.currentGuessSquare
      ].content = key;
      this.currentGuessSquare++;
    }
  }

  private Backspace(): void {
    if (this.currentGuessSquare != 0) {
      this.board.rows[this.currentGuessRow].squares[
        this.currentGuessSquare - 1
      ].content = '';
      this.currentGuessSquare--;
    }
  }

  private GuessWord(): void {
    if (this.board.rows[this.currentGuessRow].squares[4].content != '') {
      const secretWordArray = this.secretWord.split('');
      secretWordArray.forEach((value, index) => {
        const enteredLetter =
          this.board.rows[this.currentGuessRow].squares[
            index
          ].content.toUpperCase();
        let enteredWord = '';
        this.board.rows[this.currentGuessRow].squares.forEach((value) => {
          enteredWord += value.content.toUpperCase();
        });
        value = value.toUpperCase();
        if (enteredLetter === value) {
          this.board.rows[this.currentGuessRow].squares[
            index
          ].isCorrectPosition = true;
        } else if (this.secretWord.toUpperCase().includes(enteredLetter.toUpperCase())) {
          this.board.rows[this.currentGuessRow].squares[
            index
          ].isInWordButWrongPosition = true;
        } else {
          this.board.rows[this.currentGuessRow].squares[index].isNotInWord =
            false;
        }
        this.board.rows[this.currentGuessRow].squares[index].isGuessed = true;
      });
      this.currentGuessRow++;
      this.currentGuessSquare = 0;
    }
  }

  public checkForCorrectness(square: Square): string {
    if (square.isGuessed) {
      if (square.isCorrectPosition) {
        return 'correct-position';
      } else if (square.isInWordButWrongPosition) {
        return 'isinword';
      } else {
        return 'notinword';
      }
    }
    return '';
  }
}
