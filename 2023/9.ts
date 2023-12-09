import { input } from './input/9'

const lines = input.split('\n').map((l) => l.split(' ').map((n) => parseInt(n)))

/**
 * For a given array of numbers, get the difference between each pair of consecutive numbers.
 *
 * @param line - array of numbers
 * @returns difference between the array elements
 */
const trickleDown = (line: number[]) => {
  return line.reduce((acc, n, i) => {
    if (i === line.length - 1) return acc
    acc.push(line[i + 1] - n)
    return acc
  }, [] as number[])
}

/**
 * Iteratively build a triangle of number arrays by computing the difference between the number pairs in the array above.
 *
 * @param line - array of numbers
 * @returns triangle of arrays; each array represents the difference between the elements in the array before it
 */
const buildTriangle = (line: number[]) => {
  const triangle: number[][] = [line]
  while (triangle[triangle.length - 1].some((e) => e !== 0)) {
    triangle.push(trickleDown(triangle[triangle.length - 1]))
  }
  return triangle
}

/**
 * Given an input line, compute the next number in the sequence.
 * This is done by building an extrapolation triangle @see buildTriangle
 * @param line - input line
 * @returns the next number in the input sequence
 */
const extrapolate = (line: number[]): number => {
  const triangle = buildTriangle(line)
  return triangle.reverse().reduce((acc, line) => {
    return acc + line.at(-1)!
  }, 0 as number)
}

const part1 = () => {
  const results = lines.map((l) => extrapolate(l))
  return results.reduce((acc, v) => acc + v)
}

const part2 = () => {
  const results = lines.map((l) => extrapolate(l.toReversed()))
  return results.reduce((acc, v) => acc + v)
}

console.log('Part 1: ', part1())
console.log('Part 2: ', part2())
