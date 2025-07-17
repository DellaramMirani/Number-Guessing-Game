const input = document.getElementById("input");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");
const loseSound = document.getElementById("loseSound");
const winSound = document.getElementById("winSound");

let seconds = 0;
let attempts = 0;
const maxAttempts = 10;
let randomNumber = Math.floor(Math.random() * 100);
console.log(randomNumber);

const bestScoreDisplay = document.createElement("p");
const attemptPlace = document.createElement("p");

bestScoreDisplay.classList.add("text-green-600", "mt-2", "font-semibold");
attemptPlace.classList.add("text-purple-600", "bg-purple-100", "px-4", "py-2", "rounded-xl", "shadow-md", "mt-4", "transition-all", "duration-300", "text-center", "hidden");

document.body.appendChild(attemptPlace);
document.body.appendChild(bestScoreDisplay);


const timer = setInterval(() => {
    seconds++;
}, 1000);

const resetBtn = document.createElement("button");
resetBtn.textContent = "Play Again";
resetBtn.classList.add("bg-green-400", "text-white", "p-2", "rounded-full", "m-4");
resetBtn.style.display = "none";
document.body.appendChild(resetBtn);

const showBestScore = () => {
    const saved = localStorage.getItem("bestScore");
    if (saved) {
        const parsed = JSON.parse(saved);
        bestScoreDisplay.textContent = `🥇 Best Score: ${parsed.bestAttempts} attempts in ${parsed.bestTime} seconds`;
    } else {
        bestScoreDisplay.textContent = "No best score yet. Be the first";
    }
};

const resetGame = () => {
    clearInterval(timer);
    attempts = 0;
    seconds = 0;
    randomNumber = Math.floor(Math.random() * 100);
    console.log(randomNumber);

    input.disabled = false;
    submitBtn.disabled = false;
    input.value = "";
    result.textContent = "";
    attemptPlace.textContent = "";
    attemptPlace.classList.add("hidden");
    resetBtn.style.display = "none";
};

const playGame = () => {
    if (attempts < maxAttempts) {
        if (input.value === "") {
            result.textContent = "Enter Number!";
        } else {
            attempts++;
            const number = Number(input.value);

            if (number >= 0 && number <= 100) {
                if (number > randomNumber) {
                    result.textContent = "Too High 🔺";
                } else if (number < randomNumber) {
                    result.textContent = `Too Low 🔻 
                    (Attempts left: ${maxAttempts - attempts})`;
                } else {
                    winSound.play();
                    result.textContent = "Congrats 🥳";
                    attemptPlace.classList.remove("hidden");
                    attemptPlace.textContent = `It took ${attempts} attempts and ${seconds} seconds to guess the number`;
                    input.disabled = true;
                    submitBtn.disabled = true;
                    resetBtn.style.display = "inline-block";
                    clearInterval(timer);

                    const bestScore = localStorage.getItem("bestScore");
                    let isBetter = false;

                    if (bestScore) {
                        const parsed = JSON.parse(bestScore);
                        isBetter =
                            attempts < parsed.bestAttempts ||
                            (attempts === parsed.bestAttempts && seconds < parsed.bestTime);
                    }

                    if (!bestScore || isBetter) {
                        const newScore = {
                            bestAttempts: attempts,
                            bestTime: seconds
                        };
                        localStorage.setItem("bestScore", JSON.stringify(newScore));
                        showBestScore();
                    }
                }
            } else {
                result.textContent = "Enter a number between 0 and 100";
            }

            if (attempts >= maxAttempts && number !== randomNumber) {
                loseSound.play();
                result.textContent = `Out of tries! 😭 The correct number was ${randomNumber}`;
                input.disabled = true;
                submitBtn.disabled = true;
                resetBtn.style.display = "inline-block";
                clearInterval(timer);
            }
        }
    } else {
        input.disabled = true;
        submitBtn.disabled = true;
        resetBtn.style.display = "inline-block";
        clearInterval(timer);
    }
};

submitBtn.addEventListener("click", playGame);
resetBtn.addEventListener("click", resetGame);
showBestScore();
