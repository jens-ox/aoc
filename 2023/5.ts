import { input } from './input/5'

type Group = {
  // destination start, e.g. smallest soil number that seeds get mapped to
  destinationStart: number
  // source start, e.g. smallest seed number to get mapped
  sourceStart: number
  // range of the map
  rangeLength: number
}

const [
  seeds,
  seedSoil,
  soilFertilizer,
  fertilizerWater,
  waterLight,
  lightTemperature,
  temperatureHumidity,
  humidityLocation
] = input.split('\n\n')

/**
 * Helper method to map a list of seed range pairs to a sensible representation
 *
 * @param input - array of numbers
 * @returns array of [start, end] range tuples
 */
const chunk = (input: number[]): Array<[number, number]> =>
  input.reduce((result, _, index, array) => {
    if (index % 2 === 0) {
      const intermediate = array.slice(index, index + 2)
      ;(result as Array<[number, number]>).push([
        intermediate[0],
        intermediate[0] + intermediate[1]
      ])
    }
    return result
  }, []) as Array<[number, number]>

const parsedSeeds = seeds
  .replace('seeds: ', '')
  .split(' ')
  .map((x) => parseInt(x))

const seedRanges = chunk(parsedSeeds)

/**
 * Extract a group (i.e. start, destination, range) from an input line
 *
 * @param inputGroup - input line
 * @returns extracted group
 */
const groupToMap = (inputGroup: string): Group[] => {
  const lines = inputGroup.split('\n')
  // remove first line
  lines.shift()

  const parsedLines = lines.map((l) => {
    const [destinationStart, sourceStart, rangeLength] = l
      .split(' ')
      .map((x) => parseInt(x))

    return { destinationStart, sourceStart, rangeLength }
  })

  return parsedLines
}

/**
 * For Part 1, we get a list of seed numbers.
 * We first map them to soil numbers, then to fertilizers and so on.
 * For that, we use the provided groups to map them to their respective destinations.
 *
 * @param input - array of numbers
 * @param groupMap - list of groups
 * @returns transposed input array
 */
const transpose = (input: number[], groupMap: Group[]) => {
  const mapped = input.flatMap((i) => {
    const matchingFields = groupMap.filter(
      (g) => g.sourceStart <= i && g.sourceStart + g.rangeLength >= i
    )

    return matchingFields.map((g) => g.destinationStart + (i - g.sourceStart))
  })
  return mapped
}

/**
 * For Part 2, we get a list of seed number *ranges*.
 * Transposing works similar to part 1, but takes a couple more steps per input range:
 * 1. For each group, determine if it overlaps with the current input range.
 * 2. For each overlapping group, compute the resulting destination range.
 * 3. Flatten the list of overlapping groups per input range to one list of destination groups.
 *
 * @param input - list of [start, end] range pairs
 * @param groupMap - list of groups
 * @returns list of transposed range pairs
 */
const transposeRanges = (
  input: Array<[number, number]>,
  groupMap: Group[]
): Array<[number, number]> => {
  const mapped = input.map((i) => {
    const overlappingFields = groupMap.filter(
      (g) => g.sourceStart <= i[1] && g.sourceStart + g.rangeLength >= i[0]
    )

    const overlapPerGroup = overlappingFields.map((g) => {
      const mappedStart = Math.max(i[0], g.sourceStart)
      const offset = mappedStart - g.sourceStart
      const mappedRangeLength =
        Math.min(i[1], g.sourceStart + g.rangeLength) - mappedStart

      return [
        g.destinationStart + offset,
        g.destinationStart + offset + mappedRangeLength
      ]
    })

    return overlapPerGroup
  })

  return mapped.flat(1) as Array<[number, number]>
}

const seedSoilGroup = groupToMap(seedSoil)
const soilFertilizerGroup = groupToMap(soilFertilizer)
const fertilizerWaterGroup = groupToMap(fertilizerWater)
const waterLightGroup = groupToMap(waterLight)
const lightTemperatureGroup = groupToMap(lightTemperature)
const temperatureHumidityGroup = groupToMap(temperatureHumidity)
const humidityLocationGroup = groupToMap(humidityLocation)

/**
 * Get the smallest location number by transposing the seed numbers down to locations.
 *
 * @returns the smallest valid location number
 */
const part1 = () => {
  const soils = transpose(parsedSeeds, seedSoilGroup)
  const fertilizers = transpose(soils, soilFertilizerGroup)
  const waters = transpose(fertilizers, fertilizerWaterGroup)
  const lights = transpose(waters, waterLightGroup)
  const temperatures = transpose(lights, lightTemperatureGroup)
  const humidities = transpose(temperatures, temperatureHumidityGroup)
  const locations = transpose(humidities, humidityLocationGroup)

  return Math.min(...locations)
}

/**
 * Get the smallest location number by transposing the seed number ranges down to locations.
 *
 * @returns the smallest valid location number
 */
const part2 = () => {
  const soils2 = transposeRanges(seedRanges, seedSoilGroup)
  const fertilizers2 = transposeRanges(soils2, soilFertilizerGroup)
  const waters2 = transposeRanges(fertilizers2, fertilizerWaterGroup)
  const lights2 = transposeRanges(waters2, waterLightGroup)
  const temperatures2 = transposeRanges(lights2, lightTemperatureGroup)
  const humidities2 = transposeRanges(temperatures2, temperatureHumidityGroup)
  const locations2 = transposeRanges(humidities2, humidityLocationGroup)

  // smallest location number needs to be at the start of one of the valid ranges
  return Math.min(...locations2.map((l) => l[0]))
}

console.log('Part 1: ', part1())

console.log('Part 2: ', part2())
