import { ContentType } from './types'

export const typeColors: Record<ContentType, string> = {
  project: '#3182bd',
  publication: '#756bb1',
  dataset: '#31a354',
  tool: '#e6550d',
  talk: '#636363',
  media: '#de2d26',
}

export function getTypeColor(type: ContentType): string {
  return typeColors[type]
}
