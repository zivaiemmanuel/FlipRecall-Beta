/* White Hats */
class AudioController {
	constructor() {
		this.bgMusic = new Audio();
		this.flipSound = new Audio();
		this.matchSound = new Audio();
		this.victorySound = new Audio();
		this.gameOverSound = new Audio();
		
		this.bgMusic.volume = 0.5;
		this.bgMusic.loop = true;
	}
	startMusic() {
		this.bgMusic.play();
	}
	stopMusic() {
		this.bgMusic.pause();
		this.bgMusic.currentTime = 0;
	}
	flip() {
		this.flipSound.play();
	}
	match() {
		this.matchSound.play();
	}
	victory() {
		this.stopMusic();
		this.victorySound.play();
	}
	gameOver() {
		this.stopMusic();
		this.gameOverSound.play();
	}
}

class FlipRecall {
	constructor(totalTime, cards) {
		this.cardsArray = cards;
		this.totalTime = totalTime;
		this.timer = document.getElementById('time-elapsed');
		this.ticker = document.getElementById('flips');
		this.audioController = new AudioController();
	}
	
	startGame() {
		this.cardToCheck = null;
		this.totalClicks = 0;
		this.totalTime = 0;
		this.timeElapsed = 0;
		this.matchedCards = [];
		this.busy = true;
		
		setTimeout(() => {
			this.audioController.startMusic();
			this.count = this.startCount();
			this.busy = false;
		}, 500);
		this.hideCards();
		this.timer.innerHTML = this.timeElapsed;
		this.ticker.innerHTML = this.totalClicks;
	}
	
	hideCards() {
		this.cardsArray.forEach(card => {
			card.classList.remove('visible');
			card.classList.remove('matched');
		});
	}
	
	flipCard(card) {
		if(this.canFlipCard(card)) {
			this.audioController.flip();
			this.totalClicks++;
			this.ticker.innerHTML = this.totalClicks;
			card.classList.add('visible');
		
			if (this.cardToCheck){
				this.checkForCardMatch(card);
			}else {
				this.cardToCheck = card;
			}
		}
	}
	
	checkForCardMatch(card) {
		if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
			this.cardMatch(card, this.cardToCheck);
		}else {
			this.cardMisMatch(card, this.cardToCheck);
		}
		this.cardToCheck = null;
	}
	
	cardMatch(card1, card2) {
		this.matchedCards.push(card1);
		this.matchedCards.push(card2);
		card1.classList.add('matched');
		card2.classList.add('matched');
		this.audioController.match();
		if(this.matchedCards.length === this.cardsArray.length) {
			this.victory();
		}
	}
		
	cardMisMatch(card1, card2) {
		this.busy = true;
		setTimeout(() => {
			card1.classList.remove('visible');
			card2.classList.remove('visible');
			this.busy = false;
		}, 1000);
	}
	
	checkForCardX(card) {
		getCardX(card);
		
		if (this.getCardX(card)) {
			this.cardMatch(card, this.cardToCheck);
		}else {
			this.cardMisMatch(card, this.cardToCheck);
		}
		this.cardToCheck = null;
	}
	
	getCardX(card) {
		return card.getElementsByClassName('cardX');
	}
	
	getCardType(card) {
		return card.getElementsByClassName('the-front')[0].src;
	}
	
	gameOver() {
		clearInterval(this.count);
		this.audioController.gameOver();
		document.getElementById('game-over-text').classList.add('visible');
		//ready();
	}	
	
	victory() {
		clearInterval(this.count);
		this.audioController.victory();
		document.getElementById('victory-text').classList.add('visible');
	}
	
	startCount() {
		return setInterval(() => {
			this.timeElapsed++;
			this.timer.innerHTML = this.timeElapsed;
		}, 1000);
		
	}
	
	/*shuffleCards() {
		for (let i=cardsArray.length - 1; i>0 ; i--) {
			let randomIndex =Math.floor(Math.random() * (i+1));
			this.cardsArray[randomIndex].getElementsByClassName('card') = 1;
			this.cardsArray[i].getElementsByClassName('card') = randomIndex;
		}
	}*/
	
	canFlipCard(card) {
		return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
	}
}


function ready() {
	let overlays = Array.from(document.getElementsByClassName('overlay-text'));
	let cards = Array.from(document.getElementsByClassName('card'));
	let game = new FlipRecall(0, cards);
	
	overlays.forEach(overlay => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			game.startGame();
		});
	});
	
	cards.forEach(card => {
		card.addEventListener('click', () => {
			game.flipCard(card);
		});
	});
}


if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready());
} else {
	ready();
}

let audioController = new AudioController