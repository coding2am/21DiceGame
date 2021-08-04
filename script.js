"use strict";

// dice images

const images = [
  "assets/dice1.png",
  "assets/dice2.png",
  "assets/dice3.png",
  "assets/dice4.png",
  "assets/dice5.png",
  "assets/dice6.png",
];

// variables

let player1TotalScore = 0;
let player2TotalScore = 0;
let isPlayer1 = true;
let checkPoint = 21;
let isBothPlayed = false;
let player1FinalScore = 0;
let player2FinalScore = 0;

// tags
const rulesBtn = document.querySelector(".rulesBtn");
const closeBtn = document.querySelector(".closeBtn");
const startGameBtn = document.querySelector(".startGameBtn");
const restartGameBtn = document.querySelector(".restartGameBtn");
const rollBtn = document.querySelector(".rollBtn");
const holdBtn = document.querySelector(".holdBtn");
const player1StatusTag = document.querySelector(".player1Status");
const player2StatusTag = document.querySelector(".player2Status");
const rulesSliderContainerTag = document.querySelector(".rulesSliderContainer");

const player1Playing = document.querySelector(".player1Turn");
const player2Playing = document.querySelector(".player2Turn");

const dices = document.querySelectorAll("img");
const player1TotalScoreTag = document.getElementsByClassName("player1Score")[0];
const player2TotalScoreTag = document.getElementsByClassName("player2Score")[0];
const player1CurrentScore = document.getElementsByClassName(
  "player1CurrentScore"
)[0];
const player2CurrentScore = document.getElementsByClassName(
  "player2CurrentScore"
)[0];

// functions

const currentPlayingAnimation = (isPlayer1) => {
  if (isPlayer1) {
    player1Playing.style.opacity = "1";
    player2Playing.style.opacity = "0";
  } else {
    player2Playing.style.opacity = "1";
    player1Playing.style.opacity = "0";
  }
};

const stopCurrentPlayingAnimation = (currentPlayer) => {
  const playingTag = currentPlayer ? player1Playing : player2Playing;
  playingTag.style.opacity = "0";
};

const buttonOnOffAnimation = (status) => {
  startGameBtn.style.pointerEvents = "none";
  startGameBtn.style.opacity = "0";

  restartGameBtn.style.pointerEvents = "all";
  restartGameBtn.style.opacity = "1";

  if (status) {
    holdBtn.style.pointerEvents = "all";
    holdBtn.style.opacity = "1";

    rollBtn.style.pointerEvents = "all";
    rollBtn.style.opacity = "1";
  } else {
    holdBtn.style.pointerEvents = "none";
    holdBtn.style.opacity = "0";

    rollBtn.style.pointerEvents = "none";
    rollBtn.style.opacity = "0";
  }
};

const playerWonAnimation = (currentPlayer) => {
  const statusTag = currentPlayer ? player1StatusTag : player2StatusTag;
  statusTag.textContent = "You Win";
  statusTag.style.opacity = "1";
  buttonOnOffAnimation(false);
};

const startingGame = () => {
  buttonOnOffAnimation(true);
  currentPlayingAnimation(isPlayer1);
};

const rollHandler = () => {
  dices.forEach((dice) => {
    dice.classList.add("shake");
  });

  setTimeout(() => {
    dices.forEach((dice) => {
      dice.classList.remove("shake");
    });
    let diceOneValue = Math.floor(Math.random() * 6);
    let diceTwoValue = Math.floor(Math.random() * 6);

    gameMechanisms(isPlayer1, diceOneValue, diceTwoValue);

    document.querySelector("#dice1").setAttribute("src", images[diceOneValue]);
    document.querySelector("#dice2").setAttribute("src", images[diceTwoValue]);
  }, 1000);
};

const gameMechanisms = (currentPlayer, value1, value2) => {
  currentPlayingAnimation(currentPlayer);
  const currentValue = value1 + value2 + 2;

  // player-1
  if (currentPlayer) {
    player1TotalScore += currentValue;
    player1CurrentScore.textContent = currentValue;
    player1TotalScoreTag.textContent = player1TotalScore;
    checkingTotalScore(player1TotalScore, isPlayer1);
  }
  // player-2
  else {
    player2TotalScore += currentValue;
    player2CurrentScore.textContent = currentValue;
    player2TotalScoreTag.textContent = player2TotalScore;

    if (player1TotalScore === checkPoint && player2TotalScore === checkPoint) {
      player1StatusTag.textContent = "Draw";
      player2StatusTag.textContent = "Draw";
      player1StatusTag.style.opacity = "1";
      player2StatusTag.style.opacity = "1";
      stopCurrentPlayingAnimation(currentPlayer);
      return;
    }

    const isPlayer2Bigger =
      player1TotalScore < player2TotalScore ? true : false;
    const isValidScore = player2TotalScore <= checkPoint ? true : false;

    if (isPlayer2Bigger && isValidScore) {
      playerWonAnimation(currentPlayer);
      stopCurrentPlayingAnimation(currentPlayer);
    } else {
      checkingTotalScore(player2TotalScore, isPlayer1);
    }
  }
};

const checkingTotalScore = (totalScore, currentPlayer) => {
  // game over
  if (totalScore > checkPoint) {
    isBothPlayedWithDie(currentPlayer);
  }
  // bingo
  else if (totalScore == checkPoint) {
    if (currentPlayer) {
      currentPlayingAnimation(false);
      isPlayer1 = false;
      player1StatusTag.textContent = "BINGO";
      player1StatusTag.style.opacity = "1";
    } else {
      currentPlayingAnimation(true);
      isPlayer1 = true;
      player2StatusTag.textContent = "BINGO";
      player2StatusTag.style.opacity = "1";
    }
  } else {
    return;
  }
};

const isBothPlayedWithDie = (currentPlayer) => {
  const player1 = currentPlayer ? true : false;
  const playerStatusTag = currentPlayer ? player1StatusTag : player2StatusTag;

  if (isBothPlayed === false) {
    stopCurrentPlayingAnimation(player1);
    playerStatusTag.textContent = "you die";
    playerStatusTag.style.opacity = "1";
    playerWonAnimation(false);
  } else {
    player2StatusTag.textContent = "You die";
    player2StatusTag.style.opacity = "1";
    playerWonAnimation(true);
    stopCurrentPlayingAnimation(player1);
  }
};

const holdHandler = () => {
  if (!isPlayer1 || isBothPlayed) {
    if (player1TotalScore > player2TotalScore) {
      playerWonAnimation(true);
      stopCurrentPlayingAnimation(isPlayer1);
    }
  } else {
    isPlayer1 = false;
    isBothPlayed = true;
    currentPlayingAnimation(isPlayer1);
  }
};

const restartGameHandler = () => {
  player1TotalScore = 0;
  player2TotalScore = 0;
  player1CurrentScore.textContent = "0";
  player2CurrentScore.textContent = "0";
  player1TotalScoreTag.textContent = "0";
  player2TotalScoreTag.textContent = "0";
  player1StatusTag.style.opacity = "0";
  player2StatusTag.style.opacity = "0";
  isPlayer1 = true;
  isBothPlayed = false;
  currentPlayingAnimation(isPlayer1);
  buttonOnOffAnimation(true);
};

//events

startGameBtn.addEventListener("click", startingGame);
rollBtn.addEventListener("click", rollHandler);
holdBtn.addEventListener("click", holdHandler);
restartGameBtn.addEventListener("click", restartGameHandler);

closeBtn.addEventListener("click", () => {
  rulesSliderContainerTag.style.display = "none";
});
rulesBtn.addEventListener("click", () => {
  rulesSliderContainerTag.style.display = "block";
});
