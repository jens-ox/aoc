import { input } from './input/4'

/**
 * Parses one line from the input.
 *
 * @param card - card line
 * @returns cleaned-up card data
 */
const parseCard = (card: string) => {
  // to make our life easier (i.e. to be able to cleanly split the data),
  // replace consecutive spaces with single spaces and remove the Card prefix
  const cleaned = card.replaceAll(/ +/g, ' ').replace('Card ', '')
  const [cardNumber, input] = cleaned.split(': ')
  const [winning, yours] = input.split(' | ')

  return {
    cardNumber: parseInt(cardNumber),
    winning: winning.split(' ').map((n) => parseInt(n)),
    yours: yours.split(' ').map((n) => parseInt(n))
  }
}

const parsed = input.split('\n').map((l) => parseCard(l))

// the matches per card is the count of winning numbers that the card includes
const matchesPerCard = parsed.map((card) => {
  const matches = card.yours.filter((n) => card.winning.includes(n))
  return matches.length
})

/**
 * For Part 1, we compute the total amount of winning points from all cards.
 * A card's winning points is 1 for one match, and doubled for every match
 * thereafter.
 *
 * @returns summed-up winning points from all cards
 */
const part1 = () => {
  const winningPoints = matchesPerCard
    .map((count) => (count === 0 ? 0 : Math.pow(2, count - 1)))
    .reduce((acc, pow) => acc + pow, 0)

  return winningPoints
}

/**
 * For Part 2, there are no winning points. Instead, you only get more scratchcards.
 * The amount of matches per card determines how many more cards you get;
 * for 5 match points you get 5 more cards. For n match points at card x, you
 * get one more card from card x+1 to card x+n.
 *
 * @returns the total amount of cards at the end
 */
const part2 = () => {
  const cardCollection: Map<number, number> = new Map(
    new Array(matchesPerCard.length).fill(1).map((_, i) => [i, 1])
  )
  for (const [i, matchCount] of matchesPerCard.entries()) {
    if (matchCount === 0) continue
    const existingCards = cardCollection.get(i)!
    for (let j = 1; j <= matchCount; j++) {
      cardCollection.set(i + j, cardCollection.get(i + j)! + existingCards)
    }
  }

  const totalCards = Array.from(cardCollection.values()).reduce(
    (acc, count) => acc + count,
    0
  )

  return totalCards
}

console.log('Part 1', part1())
console.log('Part 2', part2())
