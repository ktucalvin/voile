export interface Chapter {
  name?: string,
  pages: number
}

export interface Gallery {
  id: number,
  name: string,
  views: number,
  description: string | null,
  chapters: {
    [key: string]: Chapter
  },
  tags: {
    [key: string]: string[]
  }
}

export interface SortOptions {
  search?: string,
  page?: number,
  sort: 'id' | 'views' | 'name',
  order: 'asc' | 'desc',
  length: number
}

/* eslint-disable camelcase */
export interface RawUrlSortOptions {
  s?: string,
  p?: string,
  sort_by?: 'id' | 'views' | 'name',
  order_by?: 'asc' | 'desc',
  length?: string
}
/* eslint-enable camelcase */

export interface RegistryData {
  data: Gallery[],
  pages: number,
  validResults?: number // Only returned for search
}
