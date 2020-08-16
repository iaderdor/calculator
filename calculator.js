const display = {
  upper: document.querySelector('#displayline1'),
  bottom: document.querySelector('#displayline2'),
  addCharacter: function (symbol) {
    if (this.allowedInDisplay()) {
      this.upper.textContent += symbol;
    }
  },
  removeCharacter: function () {
    this.upper.textContent = display.upper.textContent.slice(0, -1);
  },
  clearDisplay: function () {
    this.upper.textContent = '';
    this.bottom.textContent = '0';
  },
  addBehaviourToButton: function (button, symbol) {
    button.addEventListener('click', () => {
      this.addCharacter(symbol);
    });
  },
  addClearButton: function (button) {
    button.addEventListener('click', () => {
      this.clearDisplay();
    });
  },
  addEqualButton: function (button) {
    button.addEventListener('click', () => {
      this.solveMath();
    });
  },
  addDelButton: function (button) {
    button.addEventListener('click', () => {
      this.removeCharacter();
    });
  },
  allowedInDisplay: function (symbol) {
    return true;
  },
  solveMath: function () {
    //TODO: Make the solver
  }
};

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

display.addBehaviourToButton(but0, '0');
display.addBehaviourToButton(but1, '1');
display.addBehaviourToButton(but2, '2');
display.addBehaviourToButton(but3, '3');
display.addBehaviourToButton(but4, '4');
display.addBehaviourToButton(but5, '5');
display.addBehaviourToButton(but6, '6');
display.addBehaviourToButton(but7, '7');
display.addBehaviourToButton(but8, '8');
display.addBehaviourToButton(but9, '9');
display.addBehaviourToButton(butTimes, 'x');
display.addBehaviourToButton(butDiv, '/');
display.addBehaviourToButton(butPlus, '+');
display.addBehaviourToButton(butMinus, '-');
display.addBehaviourToButton(butDot, '.');
display.addClearButton(butC);
display.addEqualButton(butEqual);
display.addDelButton(butDel);
