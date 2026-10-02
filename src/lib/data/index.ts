import { parseDataset } from './dataset'
import rawSources from './sources.json'

const peopleFiles = import.meta.glob<unknown>('./people/*.json', { eager: true, import: 'default' })

export const { people, peopleById, sources, sourcesById } = parseDataset(
  Object.values(peopleFiles),
  rawSources,
)

export * from './schema'
export * from './books'
