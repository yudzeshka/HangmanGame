const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const message = document.getElementById("message-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const flagEl = document.getElementById("flag");
const figureParts = document.querySelectorAll(".figure-part");

const flagImg = document.createElement("img");
flagEl.append(flagImg);

const correctLetters = [];
const wrongLetters = [];

//Show flag
function showFlag() {
  flagImg.src = `${randomCountry.flag}`;
}

//Get random object
function randomobj(obj) {
  const objkeys = Object.values(obj);
  return objkeys[Math.floor(Math.random() * objkeys.length)];
}

//Show hidden word
function displayWord() {
  fetch("./src/countries.json")
    .then((res) => res.json())
    .then((data) => data)
    .then((data) => (randomCountry = randomobj(data)))
    .then(() => (flagImg.src = `${randomCountry.flag}`))
    .then(() => (selectedWord = randomCountry.name))
    .then((selectedWord) => checkWord(selectedWord))
    .then(() => {
            window.addEventListener("keydown", listener);
            // window.removeEventListener("keydown", listener);
    }
    )
    }

// Check word
function checkWord(word) {
  wordEl.innerHTML = `
 ${word
   .split("")
   .map(
     (letter) => `
     <span class="letter">
     ${correctLetters.includes(letter) ? letter : ""}
     </span>
     `
   )
   .join("")}
 `;
  innerWord = wordEl.innerText.replace(/\n/g, "");
  if (innerWord === word) {
    finalMessage.innerText = `Congratulations! You won! \n Hidden country is ${word.toUpperCase()} `;
    message.style.display = "flex";
  }
}

// listener
const listener = function(e) {
  if (e.key >= "a" && e.key <= "z") {
      const letter = e.key;
      if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
              correctLetters.push(letter);
              checkWord(selectedWord);
          } else {
              showNotification();
          }
      } else {
          if (!wrongLetters.includes(letter)) {
              wrongLetters.push(letter);
              updateWrongLettersEl();
          } else {
              showNotification();
          }
      }
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
   ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
   ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
   `;
  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;
    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
  // check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `Unfortunately you lost. \n It was ${selectedWord.toUpperCase()}`;
    message.style.display = "flex";
  }
}

//Show notification
function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Restart game and play again
playAgainBtn.addEventListener("click", () => {
    window.removeEventListener("keydown", listener);
    //Empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);
    displayWord();
    updateWrongLettersEl();
    message.style.display = "none";
});

displayWord();
