const SUITS = ["C", "D", "H", "S"];
const CARD_FACES = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K", "A"];

class Deck {
    constructor(cards) {
        this.cards = cards || SUITS.flatMap(suit => CARD_FACES.map(face => suit + face))
    }

    shuffle() {
        let shuffled = []
        while (this.cards.length) {
            shuffled.push(this.draw(true));
        }
        this.cards = shuffled;
    }

    draw(random) {
        let index = (random) ? (Math.random() * this.cards.length) >> 0 : this.cards.length - 1;
        return this.cards.splice(index, 1)[0];
    }

    split(numPiles) {
        let piles = [...(new Array(numPiles).fill(0).map(val => []))];
        for (let i = 0, c = 0; i < this.cards.length; i++, c = ++c % numPiles) {
            piles[c].push(this.cards[i]);
        }
        return piles.map(pile => new Deck(pile));
    }

    combine(deck, shuffle) {
        this.cards.concat(deck.cards);
        if (shuffle) {
            this.shuffle();
        }
    }

    placeOnTop(cardOrCards) {
        if (cardOrCards instanceof Array) {
            this.cards = this.cards.concat(cardOrCards);
        } else {
            this.cards.push(cardOrCards);
        }
    }

    placeOnBottom(cardOrCards) {
        if (cardOrCards instanceof Array) {
            this.cards = cardOrCards.concat(this.cards);
        } else {
            this.cards = [cardOrCards].concat(this.cards);
        }
    }

    peekTopCard() {
        return this.cards[this.cards.length - 1];
    }
}

class Game {

    constructor(players) {
        this.playerCount = players;
        this.players = [];
        this.war = false;
        this.playerThatWon = null;
    }

    init() {
        this.mainDeck = new Deck();
        this.mainDeck.shuffle();
        this.players = this.mainDeck.split(this.playerCount).map(player => new Player(player));
    }

    round() {
        let playersWithCards = 0;
        let lastPlayerWithCardsIndex = -1;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].stillHasCards) {
                playersWithCards++;
                lastPlayerWithCardsIndex = i;
            }
        }

        if (playersWithCards === 1) {
            this.playerThatWon = lastPlayerWithCardsIndex;
            return;
        }
        
        for (let player of this.players) {
            if (player.stillHasCards()) {
                if ((this.war && player.inWar) || !this.war) {
                    player.playCards(this.war ? 4 : 1);
                }
            }
        }

        
    }

    getCardValue(card) {
        return card ? CARD_FACES.indexOf(card.substring(1)) : -1;
    }

}

class Player {

    constructor(deck) {
        this.deck = deck;
        this.stack = new Deck([]);
        this.inWar = false;
    }

    playCards(amount) {
        for (let i = 0; i < amount && this.deck.cards.length > 0; i++) {
            this.stack.placeOnTop(this.deck.draw());
        }
    }

    getTopCardOfStack() {
        return this.stack.peekTopCard();
    }

    clearStack() {
        this.stack = new Deck([]);
    }

    stillHasCards() {
        return this.deck.cards.length > 0;
    }

}

let deck = new Deck();

