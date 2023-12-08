import { input } from './input/8'

type Node = {
  start: string
  left: string
  right: string
}

const greatestCommonDenominator = (a: number, b: number): number =>
  a ? greatestCommonDenominator(b % a, a) : b
const leastCommonMultiple = (a: number, b: number): number =>
  (a * b) / greatestCommonDenominator(a, b)

const [rawInstructions, rawNodes] = input.split('\n\n')

const nodes: Node[] = rawNodes.split('\n').map((l) => {
  const [start, lr] = l.split(' = ')
  const [left, right] = lr.replace('(', '').replace(')', '').split(', ')
  return { start, left, right }
})

const instructions = rawInstructions.split('')

/**
 * Compute the amount of steps needed to get from the start node to any of the end nodes.
 * @param startNode - node to start at
 * @param endNodes - list of valid end nodes (ZZZ for part 1, any node ending in Z for part 2)
 * @returns amount of steps needed to get from the start node to one of the end nodes
 */
const getStepCount = (startNode: Node, endNodes: Node[]): number => {
  let currentNode = startNode
  let steps = 0

  while (!endNodes.some((n) => n.start === currentNode.start)) {
    const currentDirection = instructions[steps % instructions.length]
    currentNode = nodes.find(
      (n) =>
        n.start ===
        (currentDirection === 'L' ? currentNode.left : currentNode.right)
    )!
    steps += 1
  }

  return steps
}

/**
 * For Part 1, we have to count the steps to get from AAA to ZZZ.
 */
const part1 = () => {
  return getStepCount(
    nodes.find((n) => n.start === 'AAA')!,
    nodes.filter((n) => n.start === 'ZZZ')
  )
}

/**
 * For Part 2, we start at all nodes ending in A at the same time.
 * We need to compute how many steps are needed until all are at a node ending
 * in Z simultaneously.
 *
 * For that, we first compute the amount of steps needed per node to reach a node ending in Z.
 * The smallest step count needed for all to be at an end node at the same time is the smallest number that is a multiple of both numbers; the Least Common Multiple (LCM).
 */
const part2 = () => {
  const stepsPerNode = nodes
    .filter((n) => n.start.endsWith('A'))
    .map((node) =>
      getStepCount(
        node,
        nodes.filter((n) => n.start.endsWith('Z'))
      )
    )

  // find the least common multiple of all steps needed
  return stepsPerNode.reduce((acc, steps) => leastCommonMultiple(acc, steps))
}

console.log('Part 1: ', part1())
console.log('Part 2: ', part2())
