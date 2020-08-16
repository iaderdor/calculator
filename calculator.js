class Display {
  constructor(screen) {
    this.screen = screen;
    this.clearScreen();
  }

  get getline1() {
    return this.line1value;
  }

  get getline2() {
    return this.line2value;
  }

  set setline1(par) {
    this.line1 = par;
  }

  set setline2(par) {
    this.line2 = par;
  }

  updateScreen() {
    this.screen[0].textContent = this.line1;
    this.screen[1].textContent = this.line2;
  }

  addCharacter(symbol) {
    this.line1 += symbol;
    this.updateScreen();
  }

  removeCharacter() {
    this.line1 = this.line1.slice(0, -1);
    this.updateScreen();
  }

  clearScreen() {
    this.line1 = '';
    this.line2 = 0;
    this.updateScreen();
  }
}

class Calculator {
  constructor() {
    const screen = [
      document.querySelector('#displayline1'),
      document.querySelector('#displayline2')
    ];

    this.display = new Display(screen);

    const but0 = document.querySelector('#but0');
    const but1 = document.querySelector('#but1');
    const but2 = document.querySelector('#but2');
    const but3 = document.querySelector('#but3');
    const but4 = document.querySelector('#but4');
    const but5 = document.querySelector('#but5');
    const but6 = document.querySelector('#but6');
    const but7 = document.querySelector('#but7');
    const but8 = document.querySelector('#but8');
    const but9 = document.querySelector('#but9');
    const butTimes = document.querySelector('#butTimes');
    const butDiv = document.querySelector('#butDiv');
    const butPlus = document.querySelector('#butPlus');
    const butMinus = document.querySelector('#butMinus');
    const butDot = document.querySelector('#butDot');
    const butC = document.querySelector('#butC');
    const butEqual = document.querySelector('#butEqual');
    const butDel = document.querySelector('#butDEL');

    this.addButton(but0, '0');
    this.addButton(but1, '1');
    this.addButton(but2, '2');
    this.addButton(but3, '3');
    this.addButton(but4, '4');
    this.addButton(but5, '5');
    this.addButton(but6, '6');
    this.addButton(but7, '7');
    this.addButton(but8, '8');
    this.addButton(but9, '9');
    this.addButton(butTimes, 'x');
    this.addButton(butDiv, '/');
    this.addButton(butPlus, '+');
    this.addButton(butMinus, '-');
    this.addButton(butDot, '.');
    this.addClearButton(butC);
    this.addEqualButton(butEqual);
    this.addDelButton(butDel);
  }

  addButton(button, symbol) {
    button.addEventListener('click', () => {
      this.display.addCharacter(symbol);
    });
  }

  addClearButton(button) {
    button.addEventListener('click', () => {
      this.display.clearScreen();
    });
  }

  addEqualButton(button) {
    button.addEventListener('click', () => {
      this.solveMath();
    });
  }

  addDelButton(button) {
    button.addEventListener('click', () => {
      this.display.removeCharacter();
    });
  }

  allowedInDisplay(symbol) {
    //TODO
    return true;
  }

  solveMath() {
    //TODO: Make the solver
  }
}

let calc = new Calculator();
