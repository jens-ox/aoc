import { input } from './input/7'

enum HandType {
  FIVE_OF_A_KIND = 7,
  FOUR_OF_A_KIND = 6,
  FULL_HOUSE = 5,
  THREE_OF_A_KIND = 4,
  TWO_PAIR = 3,
  ONE_PAIR = 2,
  HIGH_CARD = 1
}

type Hands = {
  cards: string[]
  bid: number
  handTypePart1: HandType
  handTypePart2: HandType
}

const cardOrderPart1 = 'AKQJT98765432'.split('')
const cardOrderPart2 = 'AKQT98765432J'.split('')

const getHandTypePart1 = (cards: string[]): HandType => {
  const groupedCards = cards.reduce(
    (acc, c) => {
      acc[c] = (acc[c] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const counts = Object.values(groupedCards)

  // all cards same
  if (counts.some((c) => c === 5)) return HandType.FIVE_OF_A_KIND
  // four cards same
  if (counts.some((c) => c === 4)) return HandType.FOUR_OF_A_KIND
  // three cards same + two cards same
  if (counts.some((c) => c === 3) && counts.some((c) => c === 2))
    return HandType.FULL_HOUSE
  // three cards same
  if (counts.some((c) => c === 3)) return HandType.THREE_OF_A_KIND
  // 2 * two cards same
  if (counts.filter((c) => c === 2).length === 2) return HandType.TWO_PAIR
  // two cards same
  if (counts.some((c) => c === 2)) return HandType.ONE_PAIR

  return HandType.HIGH_CARD
}

const getHandTypePart2 = (cards: string[]): HandType => {
  const jokers = cards.filter((c) => c === 'J').length
  const groupedCards = cards
    .filter((c) => c !== 'J')
    .reduce(
      (acc, c) => {
        acc[c] = (acc[c] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

  const counts = Object.values(groupedCards).sort((a, b) => b - a)

  if (jokers === 5) return HandType.FIVE_OF_A_KIND

  counts[0] += jokers

  // all cards same
  if (counts.some((c) => c === 5)) return HandType.FIVE_OF_A_KIND
  // four cards same
  if (counts.some((c) => c === 4)) return HandType.FOUR_OF_A_KIND
  // three cards same + two cards same
  if (counts.some((c) => c === 3) && counts.some((c) => c === 2))
    return HandType.FULL_HOUSE
  // three cards same
  if (counts.some((c) => c === 3)) return HandType.THREE_OF_A_KIND
  // 2 * two cards same
  if (counts.filter((c) => c === 2).length === 2) return HandType.TWO_PAIR
  // two cards same
  if (counts.some((c) => c === 2)) return HandType.ONE_PAIR

  return HandType.HIGH_CARD
}

const orderByCard = (cardA: string, cardB: string, isPart2 = false): number => {
  const set = isPart2 ? cardOrderPart2 : cardOrderPart1
  const cardIndexA = set.findIndex((c) => c === cardA)
  const cardIndexB = set.findIndex((c) => c === cardB)
  return cardIndexB - cardIndexA
}

const hands: Hands[] = input.split('\n').map((l) => {
  const [rawCards, rawBid] = l.split(' ')
  const cards = rawCards.split('')
  return {
    cards,
    bid: parseInt(rawBid),
    handTypePart1: getHandTypePart1(cards),
    handTypePart2: getHandTypePart2(cards)
  }
})

const part1 = () => {
  const sortedHands = hands.sort((a, b) => {
    // 1.: different hands
    if (a.handTypePart1 !== b.handTypePart1)
      return a.handTypePart1 - b.handTypePart1

    // 2.: same hand
    let cardCompare = 0
    for (let i = 0; i < 5; i++) {
      cardCompare = orderByCard(a.cards[i], b.cards[i])
      if (cardCompare !== 0) break
    }

    return cardCompare
  })
  return sortedHands
    .map((c, i) => c.bid * (i + 1))
    .reduce((acc, v) => acc + v, 0)
}

const part2 = () => {
  const sortedHands = hands.sort((a, b) => {
    // 1.: different hands
    if (a.handTypePart2 !== b.handTypePart2)
      return a.handTypePart2 - b.handTypePart2

    // 2.: same hand
    let cardCompare = 0
    for (let i = 0; i < 5; i++) {
      cardCompare = orderByCard(a.cards[i], b.cards[i], true)
      if (cardCompare !== 0) break
    }

    return cardCompare
  })
  return sortedHands
    .map((c, i) => c.bid * (i + 1))
    .reduce((acc, v) => acc + v, 0)
}

console.log('Part 1: ', part1())
console.log('Part 2: ', part2())
