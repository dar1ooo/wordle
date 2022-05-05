import { Component, HostListener, OnInit } from '@angular/core';
import { WORDS } from './data/normals.words';
import { SWISSWORDS } from './data/swiss.words';
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
  public headerText = '';
  public showDialog = false;
  public category = '';

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code.includes('Key')) {
      this.keyPressed(event.key);
    } else if (event.code === 'Backspace') {
      this.backspace();
    } else if (event.code === 'Enter') {
      this.guessWord();
    }
  }

  public ngOnInit(): void {
    this.initBoard();
  }

  public initBoard(): void {
    this.board = new Board();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('category');
    if (code) {
      if (code === 'swiss') {
        this.secretWord =
          SWISSWORDS[Math.floor(Math.random() * SWISSWORDS.length)];
        this.headerText = 'WÖRDL | Bünzli version';
        this.category = 'swiss';
      } else {
        this.secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        this.headerText = 'WORDLE | normal';
        this.category = 'normal';
      }
    } else {
      this.secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      this.headerText = 'WORDLE| normal';
      this.category = 'normal';
    }

    for (let i = 0; i < 6; i++) {
      const row = new Row();
      for (let j = 0; j < this.secretWord.length; j++) {
        const square = new Square();
        row.squares.push(square);
      }

      this.board.rows.push(row);
    }
  }

  private keyPressed(key: string): void {
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

  public keyboardClicked(pressedKey: string): void {
    this.keyPressed(pressedKey);
  }

  public backspace(): void {
    if (this.currentGuessSquare != 0) {
      this.board.rows[this.currentGuessRow].squares[
        this.currentGuessSquare - 1
      ].content = '';
      this.currentGuessSquare--;
    }
  }

  public guessWord(): void {
    if (this.board.rows[this.currentGuessRow].squares[this.secretWord.length - 1].content != '') {
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
        } else if (
          this.secretWord.toUpperCase().includes(enteredLetter.toUpperCase())
        ) {
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
    if (this.currentGuessRow === 6) {
      this.showDialog = true;
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

  public closeDialog(): void {
    this.showDialog = false;
    this.currentGuessRow = 0;
    this.initBoard();
  }
}
