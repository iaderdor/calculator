class Token {
  constructor() {
    this.inst = null;
    this.tokens = [];
  }

  static isNumber(c) {
    return /\d/.test(c);
  }

  static isOperator(c) {
    const operators = '+-x/'.split('');
    return operators.some(operator => {
      return c === operator;
    });
  }

  tokenize(str) {
    str = str.trim();
    let s = '';

    for (var idx = 0; idx < str.length; idx++) {
      s += str[idx];
      const following = str[idx + 1];
      if (Token.isNumber(s.trim()) && !Token.isNumber(following)) {
        this.tokens.push({ type: 'NUM', value: s.trim() });
        s = '';
        continue;
      }

      if (Token.isOperator(s.trim())) {
        this.tokens.push({ type: 'OP', value: s.trim() });
        s = '';
        continue;
      }

      if (idx == str.length - 1) {
        this.tokens.push({ type: 'EOF' });
        continue;
      }
    }
    return this.tokens;
  }
}

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
      if (this.allowedInDisplay(symbol)) {
        this.display.addCharacter(symbol);
      }
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
    const str = this.display.line1;
    const previousChar = str[str.length - 1];

    // If the symbol is a number, we allways allow this to be typed.
    // By the way, if it's an operator, we don't want two operators typed
    // together, expect if the last one is a minus, for operation like 2 * (-7)

    if (
      Token.isOperator(symbol) &&
      (Token.isOperator(previousChar) || typeof previousChar === 'undefined')
    ) {
      if (Token.isOperator(str[str.length - 2])) {
        return false;
      }
      if (symbol !== '-' && typeof str[str.length - 2] === 'undefined') {
        return false;
      }
    }

    if (symbol === '-' && previousChar === '-') {
      return false;
    }
    return true;
  }

  nullifyToken(tokens, pos) {
    tokens[pos].value = '';
    tokens[pos].type = 'NULL';
  }

  deleteNullTokens(tokens) {
    return tokens.filter(token => token.type !== 'NULL');
  }

  parseTokens(tokens) {
    // Convert tokens.value strings to number
    tokens.map(token => {
      const regex = /\d+/;
      if (regex.test(token.value)) {
        token.value = Number(token.value);
      }
    });

    // Get idx of OP tokens with -
    const minusPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP' && /[-]/.test(token.value)) {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);

    // Convert a minus sign and a number into a negative number.
    if (minusPos.length > 1) {
      minusPos.forEach(pos => {
        if (pos === 0) {
          this.nullifyToken(tokens, pos);
          tokens[pos + 1].value = -tokens[pos + 1].value;
        } else {
          if (tokens[pos].type === tokens[pos - 1].type) {
            this.nullifyToken(tokens, pos);
            tokens[pos + 1].value = -tokens[pos + 1].value;
          }
        }
      });
    }
    tokens = this.deleteNullTokens(tokens);

    // Check there's no errors

    // First token must be a number
    if (tokens[0].type != 'NUM') {
      return false;
    }

    // OP tokens must be alone
    const opPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP') {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);
    for (let idx = 0; idx < idx - 1; idx++) {
      if (opPos[idx] + 1 == opPos[idx + 1]) {
        return false;
      }
    }

    return true;
  }

  multiplyAndDivide(tokens) {
    // Locate position of multiplication operators
    const multiplyRegex = /[x]/;
    const divisionRegex = /[/]/;

    const multiplyPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP' && multiplyRegex.test(token.value)) {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);

    multiplyPos.forEach(pos => {
      tokens[pos - 1].value = tokens[pos - 1].value * tokens[pos + 1].value;
      this.nullifyToken(tokens, pos);
      this.nullifyToken(tokens, pos + 1);
      tokens = this.deleteNullTokens(tokens);
    });

    // Locate position of division operators
    const divisionPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP' && divisionRegex.test(token.value)) {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);

    divisionPos.forEach(pos => {
      tokens[pos - 1].value = tokens[pos - 1].value / tokens[pos + 1].value;
      this.nullifyToken(tokens, pos);
      this.nullifyToken(tokens, pos + 1);
      tokens = this.deleteNullTokens(tokens);
    });

    return tokens;
  }

  solveMath() {
    let expression = new Token();
    console.log(expression.tokenize(this.display.line1));
    this.display.clearScreen();

    //TODO: Make the solver
  }
}

let calc = new Calculator();
