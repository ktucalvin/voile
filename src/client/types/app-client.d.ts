import { Chapter } from '../../common/types/app'

interface ChapterWithNumber extends Chapter {
  // oxymoronic, but saves a parseInt() and allows decimal chapters (e.g. '14.1')
  number: string
}
