import { input } from './input/6'

type Game = {
  time: number
  distance: number
}

/**
 * Extract the different games for part 1 from the input.
 * @returns games for part 1
 */
const inputGame1 = (): Game[] => {
  const [timeRaw, distanceRaw] = input.split('\n')
  const times = timeRaw
    .replace('Time:', '')
    .trim()
    .split(/ +/)
    .map((x) => parseInt(x))
  const distances = distanceRaw
    .replace('Distance: ', '')
    .trim()
    .split(/ +/)
    .map((x) => parseInt(x))

  return times.map((t, i) => ({ time: t, distance: distances[i] }))
}

/**
 * For part 2, parse the whole input as one single game.
 *
 * @returns big game for part 2
 */
const inputGame2 = (): Game => {
  const [timeRaw, distanceRaw] = input.split('\n')

  return {
    time: parseInt(timeRaw.replaceAll(/[^0-9]/g, '')),
    distance: parseInt(distanceRaw.replaceAll(/[^0-9]/g, ''))
  }
}

/**
 * Solve quadratic formulas using the Mitternachtsformel.
 *
 * @param a - ax^2
 * @param b - bx
 * @param c - c
 * @returns - solutions of the quadratic formula
 */
const mnf = (a: number, b: number, c: number): [number, number] => [
  (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
  (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
]

/**
 * Compute the amount of different holding times to beat the current record.
 * The holding time needed to reach the current record can be noted like this:
 *
 * distance = timeHeld * (timeEnd - timeHeld)
 *
 * The first part (timeHeld) is the speed after holding, the second part the remaining time.
 * Restructuring this, we get
 *
 * timeHeld^2 - timeEnd * timeHeld + distance = 0
 *
 * We can now solve this quadratic formula for timeHeld, as timeEnd and distance are constants.
 * The values between the two results are the holding times beating the record.
 *
 * @param game - game to solve
 * @returns the amount of different holding times to beat the current record
 */
const winningHoldCount = (game: Game) => {
  const rawSolutions = mnf(1, -game.time, game.distance)
    .sort((a, b) => a - b)
    .map((x) => Math.abs(x))

  const range = [Math.ceil(rawSolutions[0]), Math.floor(rawSolutions[1])]

  return range[1] - range[0] + 1
}

const games = inputGame1()
const bigGame = inputGame2()

console.log(
  'Part 1: ',
  games
    .map((g) => winningHoldCount(g))
    .reduce((acc, count) => (acc === 0 ? count : count * acc))
)

console.log('Part 2: ', winningHoldCount(bigGame))
