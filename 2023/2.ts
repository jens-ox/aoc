import { input } from './input/2'

// Amount of cubes in the bag for part 1
const countsInBag = new Map<string, number>([
  ['red', 12],
  ['green', 13],
  ['blue', 14]
])

/**
 * Extract the draws from one game.
 *
 * @param game - game line
 * @returns a list of count-color-pairs
 */
const getDraws = (game: string) => {
  const [, drawsString] = game.replace('Game ', '').split(': ')
  const draws = drawsString
    // we don't care about the specific parts of the game as it has no
    // influence on whether or not the game is valid or on the smallest
    // possible amount of cubes per color
    .split('; ')
    .flatMap((x) => x.split(', '))
    .map((c) => c.split(' '))
    .map(([count, color]) => [color, parseInt(count)] as [string, number])

  return draws
}

/**
 * For part 1, we will determine whether or not the amount of cubes drawn
 * is possible with the amount of cubes in the bag.
 *
 * For that, we will create a flat map of all draws in the game.
 * If a draw has a higher count than there are cubes of the specific color
 * in the bag, then the game is invalid.
 *
 * @param game - game line
 * @returns whether or not the game is possible with the cubes in the bag
 */
const isGameValid = (game: string) => {
  const draws = getDraws(game)
  return draws.every(([color, count]) => countsInBag.get(color)! >= count)
}

/**
 * For part 2, we will compute the smallest possible count of cubes per color
 * to make the game valid.
 *
 * Once we have that, we will multiply all cube values to get the "power" of
 * the specific game.
 *
 * @param game - game line
 * @returns the multiplication of all fewest possible cube values
 */
const fewestPossible = (game: string) => {
  const draws = getDraws(game)

  const fewest = draws.reduce(
    (acc, [color, count]) => {
      // the smallest possible amount of cubes per color is the largest draw per color
      acc[color] = acc[color] ? Math.max(acc[color], count) : count
      return acc
    },
    {} as Record<string, number>
  )

  // multiply all smallest possible draws to get the "power" of the game
  return Object.values(fewest).reduce(
    (acc, val) => (acc === 0 ? val : acc * val),
    0
  )
}

/**
 * Get the ID of a game.
 *
 * @param game - game line
 * @returns ID of the game
 */
const getId = (game: string) => {
  const [id] = game.replace('Game ', '').split(': ')
  return parseInt(id)
}

const result = input
  .split('\n')
  .filter((g) => isGameValid(g))
  .map((g) => getId(g))
  .reduce((sum, id) => sum + id, 0)
console.log('Part 1: ', result)

const result2 = input
  .split('\n')
  .map((g) => fewestPossible(g))
  .reduce((sum, id) => sum + id, 0)
console.log('Part 2: ', result2)
