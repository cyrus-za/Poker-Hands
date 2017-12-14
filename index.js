const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits = ['h', 's', 'd', 'c'];

const dictionary = {
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    T: 'Ten',
    J: 'Jack',
    Q: 'Queen',
    K: 'King',
    A: 'Ace',
    h: 'Hearts',
    s: 'Spades',
    d: 'Diamonds',
    c: 'Clubs'
}


class Deck {
    constructor() {
        this.cards = [];
        for ( let i = 1; i <= 13; i++ ) {
            let number = i;
            if (i === 1) number = 'A';
            if (i === 10) number = 'T';
            if (i === 11) number = 'J';
            if (i === 12) number = 'Q';
            if (i === 13) number = 'K';
            for ( let j = 0; j < 4; j++ ) {
                this.cards.push(new Card('' + number + suits[j]))
            }
        }
        this.shuffle();
    }

    shuffle() {
        console.log(`Shuffling deck`)
        for ( let i = this.cards.length - 1; i > 0; i-- ) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        const card = this.cards.pop();
        console.log(`Drawing card: ${card.printName}`)
        return card;

    }
}

class Card {
    constructor(str) {
        this.number = str[0].toUpperCase();
        this.suit = str[1].toLowerCase();
        this.rank = cardValues.indexOf(this.number);
        this.printName = `${dictionary[this.number]} of ${dictionary[this.suit]}`;
    }
}


class Hand {
    constructor(cards) {
        this.cards = cards
            .map(c => typeof c === 'string' ? new Card(c) : c)
            .sort((a, b) => a.rank < b.rank ? 1 : a.rank === b.rank ? 0 : -1)
        this.suits = {};
        this.values = [];
        this.cards.forEach(card => {
            this.suits[card.suit] = this.suits[card.suit] || [];
            this.values[card.rank] = this.values[card.rank] || [];
            this.suits[card.suit].push(card);
            this.values[card.rank].push(card);
        })
        this.values.sort((a, b) => {
            if (a.length > b.length) return 1;
            if (a.length < b.length) return -1;
            return a.rank > b.rank;
        });

        const calculation = this.calculate();
        this.strength = calculation.strength;
        this.name = calculation.name;
        this.calculatedValues = calculation.calculatedValues;

        console.log(`\nNew hand: ${this.cards.map(c => c.printName).join(', ')}`)
        console.log(`This hand is a ${this.calculate().name}\n`)
    }

    Straight() {
        if (!this.OnePair() && this.cards[0].rank - this.cards[4].rank === 4)
            return this.cards.map(c => c.rank)
    }

    Flush() {
        const suit = this.cards[0].suit;
        if (!this.cards.find(c => c.suit !== suit))
            return this.cards.map(c => c.rank)
    }

    StraightFlush() {
        if (this.Flush() && this.Straight())
            return this.cards.map(c => c.rank)
    }

    RoyalFlush() {
        if (this.StraightFlush() && this.values.map(v => v[0].rank).includes(12))
            return this.values.map(v => v[0].rank)
    }

    FourOfAKind() {
        if (this.values.find(v => v && v.length === 4))
            return this.values.map(v => v[0].rank);
    }

    FullHouse() {
        if (this.OnePair() && this.ThreeOfAKind())
            return this.values.map(v => v[0].rank);
    }

    ThreeOfAKind() {
        if (this.values.find(v => v && v.length === 3))
            return this.values.map(v => v[0].rank);
    }

    TwoPair() {
        if ([0, ...this.values].reduce((acc, cur) => {
                if (cur && cur.length === 2) return acc + 1;
                return acc;
            }) === 2)
            return this.values.map(v => v[0].rank);
    }

    OnePair() {
        if (this.values.find(v => v && v.length === 2))
            return this.values.map(v => v[0].rank);
    }

    HighCard() {
        return this.cards.map(c => c.rank);
    }

    calculate() {
        if (this.RoyalFlush()) {
            return {
                strength: 9,
                name: 'RoyalFlush',
                calculatedValues: this.RoyalFlush()
            };
        }
        if (this.StraightFlush()) {
            return {
                strength: 8,
                name: 'StraightFlush',
                calculatedValues: this.StraightFlush()
            };
        }
        if (this.FourOfAKind()) {
            return {
                strength: 7,
                name: 'FourOfAKind',
                calculatedValues: this.FourOfAKind()
            };
        }
        if (this.FullHouse()) {
            return {
                strength: 6,
                name: 'FullHouse',
                calculatedValues: this.FullHouse()
            };
        }
        if (this.Flush()) {
            return {
                strength: 5,
                name: 'Flush',
                calculatedValues: this.Flush()
            };
        }
        if (this.Straight()) {
            return {
                strength: 4,
                name: 'Straight',
                calculatedValues: this.Straight()
            };
        }
        if (this.ThreeOfAKind()) {
            return {
                strength: 3,
                name: 'ThreeOfAKind',
                calculatedValues: this.ThreeOfAKind()
            };
        }
        if (this.TwoPair()) {
            return {
                strength: 2,
                name: 'TwoPair',
                calculatedValues: this.TwoPair()
            };
        }
        if (this.OnePair()) {
            return {
                strength: 1,
                name: 'OnePair',
                calculatedValues: this.OnePair()
            };
        }
        return {
            strength: 0,
            name: 'HighCard',
            calculatedValues: this.HighCard()
        };
    }
}

const royalFlush = new Hand(['Ah', 'Kh', 'Qh', 'Jh', 'Th']);
const straightFlush = new Hand(['8c', '7c', '6c', '5c', '4c']);
const fourOfAKind = new Hand(['5d', '5s', '5h', '5c', '3h']);
const fullHouse = new Hand(['Kh', 'Kd', 'Ks', '5h', '5c']);
const fullHouse2 = new Hand(['5h', 'Kd', 'Ks', '5h', '5c']);
const flush = new Hand(['Ks', 'Js', '9s', '7s', '3s']);
const straight = new Hand(['Qs', 'Jd', 'Tc', '9s', '8h']);
const threeOfAKind = new Hand(['Qs', 'Qh', 'Qd', '5s', '9c']);
const twoPair = new Hand(['Kh', 'Ks', 'Jc', 'Jd', '9d']);
const onePair = new Hand(['Ac', 'Ad', '9h', '6h', '4d']);
const highCard = new Hand(['Ad', '7h', '6c', '3d', '2s']);

const compare = (a, b) => {
    if (a.strength < b.strength) return 1;
    if (a.strength > b.strength) return -1;
    //Need to filter out blank numbers due to shuffling indexed array
    for ( let i = 0; i < a.calculatedValues.filter(v => v).length; i++ ) {
        if (a.calculatedValues[i] > b.calculatedValues[i]) return 1;
        if (a.calculatedValues[i] < b.calculatedValues[i]) return -1;
    }
    return 0;
}

const testHands = [royalFlush, straightFlush, fourOfAKind, fullHouse, fullHouse2, flush, straight, threeOfAKind, twoPair, onePair, highCard];
const sortedHands = testHands.sort(compare);

console.log('Running test cases as per examples on http://www.wsop.com/poker-hands/')
console.log('________________')

const tests = [
    'RoyalFlush',
    'StraightFlush',
    'FourOfAKind',
    'FullHouse',
    'FullHouse',
    'Flush',
    'Straight',
    'ThreeOfAKind',
    'TwoPair',
    'OnePair',
    'HighCard'
];
tests.forEach((str, i) => console.log(`${str} should equal ${sortedHands[i].name}`))
console.log('________________')

const deck = new Deck();

const hands = [];
while ( deck.cards.length >= 5 ) {
    const drawnCards = [];
    for ( let i = 0; i < 5; i++ ) {
        const card = deck.drawCard();
        drawnCards.push(card);
    }
    const hand = new Hand(drawnCards);
    hands.push(hand);
    drawnCards.length = 0;
}
console.log('\nSorting hands: \n')
hands.sort(compare).forEach(h => console.log(`${h.name} - ${h.cards.map(c => c.printName).join(', ')}`));