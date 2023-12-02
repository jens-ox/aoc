import { input } from './input/1'

const VALID_SUBSTRINGS_PART_1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
const VALID_SUBSTRINGS_PART_2 = [
  ...VALID_SUBSTRINGS_PART_1,
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

const stringToDigitMap = new Map<string, number>([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9]
])

/**
 * Convert a substring (either a digit or the textual representation of a digit) to its numeric value.
 * This relies on the textual representations being longer than one character.
 *
 * @param substring - substring to convert
 * @returns numeric value of the substring
 */
const substringToDigit = (substring: string): number => {
  if (substring.length > 1) {
    const valueFromMap = stringToDigitMap.get(substring)
    if (!valueFromMap) throw new Error('Illegal substring requested')
    return valueFromMap
  } else {
    return parseInt(substring)
  }
}

/**
 * Find the first or last matching substring from a list of substrings.
 *
 * @param line - line to search for substrings
 * @param substrings - list of substrings to search
 * @param first - whether to return first or last match
 * @returns first/last matching substring
 */
const findSubstring = (
  line: string,
  substrings: string[],
  first: boolean
): string =>
  substrings
    .map((substring) => ({
      substring,
      position: first ? line.indexOf(substring) : line.lastIndexOf(substring)
    }))
    // filter out substrings that were not found
    .filter((match) => match.position >= 0)
    // if we want the first matching substring, order ascending; else, order descending
    .sort((match1, match2) =>
      first
        ? match1.position - match2.position
        : match2.position - match1.position
    )[0].substring

/**
 * Part 1
 * ======
 *
 * Per input line, find the first and the last digit, glue them together
 * and return the resulting two-digit integer (i.e. the "calibration value").
 *
 * Afterwards, sum them all up.
 */
const part1 = (): number => {
  // split the input into an array of individual lines
  const lines = input.split('\n')

  // for each line, remove all non-numeric characters
  const linesWithoutCharacters = lines.map((l) => l.replace(/\D/g, ''))

  // map each line to the resulting two-digit integer
  const calibrationValues = linesWithoutCharacters.map((l) => {
    const firstDigit = l[0]
    const lastDigit = l[l.length - 1]
    return parseInt(`${firstDigit}${lastDigit}`)
  })

  // sum up the calibration values
  const result = calibrationValues.reduce(
    (sum, calibrationValue) => sum + calibrationValue,
    0
  )

  return result
}

/**
 * Part 2
 * ======
 *
 * Same as part 1, but spelled-out digits (e.g. "two") also count.
 * Note that replacing the spelled-out digits with actual digits won't work,
 * as "eightwo" will result in different results depending on the replacement order.
 */
const part2 = (): number => {
  // split the input into an array of individual lines
  const lines = input.split('\n')

  // for each line, find the first and last matching substring, which results in an array of string tuples
  const substringPairs: Array<[string, string]> = lines.map((l) => [
    findSubstring(l, VALID_SUBSTRINGS_PART_2, true),
    findSubstring(l, VALID_SUBSTRINGS_PART_2, false)
  ])

  // convert the substring pairs to calibration values
  const calibrationValues = substringPairs.map(([substring1, substring2]) => {
    const digit1 = substringToDigit(substring1)
    const digit2 = substringToDigit(substring2)
    return digit1 * 10 + digit2
  })

  // sum up the calibration values
  const result = calibrationValues.reduce(
    (sum, calibrationValue) => sum + calibrationValue,
    0
  )

  return result
}

console.log('Result part 1: ', part1())
console.log('Result part 2: ', part2())
