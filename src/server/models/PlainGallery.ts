/**
 * Represents a plain JS object that represents a gallery formatted for the view to use
 */
export interface PlainGallery {
  id: number,
  name: string,
  views: number,
  description: string | null,
  chapters: {
    [key: string]: {
      name?: string,
      pages: number
    }
  },
  tags: {
    language?: string[]
    category?: string[]
    group?: string[]
    artist?: string[]
    parody?: string[]
    character?: string[]
    content?: string[]
  }
}
