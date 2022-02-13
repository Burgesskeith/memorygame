/*
 Memory Game
 Keith Burgess 2021
 Click a tile and then another to reveal 2 numbers.  Memorise the position of the numbers for the next attempt.
*/
let grWidth = 6;
let grHeight = 6;
let numTiles = grWidth * grHeight;
let grid = [grWidth][grHeight];
let tileContainer = document.getElementById("container");
let rowContainer = document.getElementById("row");
let nextDiv;
let rowDiv;
let nextP;
let allTiles = [];
let twoCards = [];
let clickCount = 0;
let totalClicks = 0;
let matches = 0;
let resultsArea = document.getElementById("result");
resultsArea.hidden = true;
let freezeClick = false; // allows clicks.  Set to true to stop clicks.

const gameOver = () => {
  resultsArea.hidden = false;
  anouncement = document.getElementById("announce");
  attempts = document.getElementById("attempts");
  anouncement.innerText = "Game Over!";
  if (totalClicks / 2 === grWidth) {
    attempts.innerText = `Total attempts = ${totalClicks / 2} which is 100%! \n Well Done!`
  } else {
    attempts.innerText =`Total attempts = ${Math.round(totalClicks / 2)} which is ${
        Math.round((grWidth / (totalClicks / 2)) * 100)
      }%`
  }
};

function loadTiles(tile) {
  let key;
  let used = {};
  let random1;
  let random2;
  let found = true;
  let posIsTaken;
  let spotOnBoard;
  while (found) {
    random1 = Math.floor(Math.random() * grWidth) + 1;
    random2 = Math.floor(Math.random() * grHeight) + 1;
    key = `r${random1.toString()}c${random2.toString()}`;
    spotOnBoard = document
      .getElementById(key)
      .getElementsByClassName("tileNumbers")[0].innerText;
    // if the position already has a value, try again
    if (spotOnBoard !== "") {
      posIsTaken = true;
    } else {
      posIsTaken = false;
    }

    if (!posIsTaken) {
      used["pos"] = key;
      used["val"] = tile;
      allTiles.push(used);
      document
        .getElementById(`r${random1}c${random2}`)
        .getElementsByClassName("tileNumbers")[0].innerText = tile;
      found = false;
    }
  }
}

// add divs and paras to the container with rc id's
const buildTable = (grWidth, grHeight) => {
  for (let a = 1; a <= grHeight; ++a) {
    for (let b = 1; b <= grWidth; ++b) {
      nextDiv = document.createElement("div");
      nextDiv.setAttribute("id", `r${a}c${b}`);
      nextDiv.setAttribute("class", "card");
      tileContainer.appendChild(nextDiv);
      nextP = document.createElement("p");
      nextP.setAttribute("class", "tileNumbers");
      nextDiv.appendChild(nextP);
    }
  }
};

// add tiles to the container - 2 of each number
const addTiles = () => {
  for (let i = 0; i < 2; i++) {
    for (let j = 1; j <= numTiles / 2; j++) {
      loadTiles(j);
    }
  }
};

const checkForMatched = (e) => {
  totalClicks++;
  let keyClicked = e.currentTarget.id;
  if (document.getElementById(keyClicked).className !== "matched") {
    flipTile(e);
  }
};

const flipTile = (e) => {
  clickCount++;
  if (clickCount === 1) {
    key1 = e.currentTarget.id;
    let firstNum = document
      .getElementById(key1)
      .getElementsByClassName("tileNumbers")[0].innerText;
    document.getElementById(key1).className = "reveal";
    twoCards.push(firstNum);
    clickCount++;
  } else {
    key2 = e.currentTarget.id;
    let secondNum = document
      .getElementById(key2)
      .getElementsByClassName("tileNumbers")[0].innerText;
    if (document.getElementById(key1).className === "matched") {
      console.log("these tiles are already matched");
      return;
    } else {
      document.getElementById(key2).className = "reveal";
      twoCards.push(secondNum);
    }

    if (twoCards[0] === twoCards[1]) {
      matches++;      
      // console.log(`Match!  ${twoCards[0]} = ${twoCards[1]}`);
      document.getElementById(key1).className = "matched";
      document.getElementById(key2).className = "matched";
      if (matches === numTiles / 2) {
        gameOver();
      }
      
      twoCards = [];
      clickCount = 0;
    } else {
      freezeClic = true;
      setTimeout(() => {
        clickCount = 0;
        twoCards = [];
        document.getElementById(key1).className = "card";
        document.getElementById(key2).className = "card";
        freezeClic = false;
      }, 2000);
      
    }
  }
};

let listenForClick = function (card) {
  card.addEventListener("click", checkForMatched);
};

const addListeners = () => {
  let card = document.getElementsByClassName("card");
  let cards = [...card];
  for (var i = 0; i < cards.length; i++) {
    listenForClick(cards[i]);
  }
};

document.addEventListener("click", e => {
    if (freezeClic) {
        e.stopPropagation();
        e.preventDefault();
    }
}, true);

const playAgain = () => {
  console.log("I was clicked!");
  window.location.reload();
}

buildTable(grWidth, grHeight);
addTiles();
addListeners();
