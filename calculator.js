class Token {
  constructor() {
    this.inst = null;
    this.tokens = [];
  }

  static isNumber(c) {
    return /[0-9.]/.test(c);
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
    this.SCREENSIZE1 = 32;
    this.SCREENSIZE2 = 10;
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
    let textForLine1 = String(this.line1);
    let textForLine2 = String(this.line2);

    if (textForLine1.length > this.SCREENSIZE1) {
      textForLine1 = textForLine1.slice(textForLine1.length - this.SCREENSIZE1);
    }
    if (textForLine2.length > this.SCREENSIZE2) {
      let hasDot = textForLine2.indexOf('.') !== -1;

      if (hasDot) {
        textForLine2 = Number(textForLine2).toPrecision(this.SCREENSIZE2 - 1);
        textForLine2 = String(textForLine2);
      } else {
        textForLine2 = Number(textForLine2).toPrecision(this.SCREENSIZE2 - 5);
        textForLine2 = String(textForLine2);
      }
    }

    this.screen[0].textContent = textForLine1;
    this.screen[1].textContent = textForLine2;
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
    this.lastAns = 0;

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
    const butAns = document.querySelector('#butANS');

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
    this.addButton(butAns, 'A');
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
      if (symbol !== '-') {
        return false;
      }
    }

    if (symbol === '-' && previousChar === '-') {
      return false;
    }

    // If it's an A (for las ANSwer), last character should be an operator.
    if (
      symbol === 'A' &&
      !Token.isOperator(previousChar) &&
      typeof previousChar !== 'undefined'
    ) {
      return false;
    }

    if (previousChar === 'A' && Token.isNumber(symbol)) {
      return false;
    }

    // If it's a dot, we check that there is no more dots in the substring
    // between operators
    if (symbol === '.') {
      const dotRegex = /(^|[+\-*/])\d*[.]\d*$/;
      if (dotRegex.test(str)) {
        return false;
      }
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

  addAndSubstract(tokens) {
    // Locate position of addition operators
    const additionRegex = /[+]/;
    const substractionRegex = /[-]/;

    const additionPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP' && additionRegex.test(token.value)) {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);

    additionPos.forEach(pos => {
      tokens[pos - 1].value = tokens[pos - 1].value + tokens[pos + 1].value;
      this.nullifyToken(tokens, pos);
      this.nullifyToken(tokens, pos + 1);
      tokens = this.deleteNullTokens(tokens);
    });

    // Locate position of division operators
    const substractionPos = tokens
      .map((token, idx) => {
        if (token.type === 'OP' && substractionRegex.test(token.value)) {
          return idx;
        } else {
          return undefined;
        }
      })
      .filter(x => x !== undefined);

    substractionPos.forEach(pos => {
      tokens[pos - 1].value = tokens[pos - 1].value - tokens[pos + 1].value;
      this.nullifyToken(tokens, pos);
      this.nullifyToken(tokens, pos + 1);
      tokens = this.deleteNullTokens(tokens);
    });

    return tokens;
  }

  solveMath() {
    let expression = new Token();
    let line1 = this.display.line1;
    line1 = line1.replaceAll('A', this.lastAns);
    expression.tokenize(line1);

    if (!this.parseTokens(expression.tokens)) {
      this.display.line2 = 'Error';
      this.display.updateScreen();
    }

    expression.tokens = this.multiplyAndDivide(expression.tokens);
    expression.tokens = this.addAndSubstract(expression.tokens);

    this.display.line1 = '';
    this.display.line2 = expression.tokens[0].value;
    this.lastAns = expression.tokens[0].value;
    this.display.updateScreen();
  }
}

let calc = new Calculator();
