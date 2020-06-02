import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Chapter } from './Chapter'
import { Tag } from './Tag'
import { PlainGallery } from './PlainGallery'

@Index('gallery_name', ['galleryName'], { unique: true })
@Entity('galleries')
export class Gallery {
  @PrimaryGeneratedColumn({ type: 'int', name: 'gallery_id', unsigned: true })
  galleryId: number

  @Column('varchar', { name: 'gallery_name', unique: true, length: 255 })
  galleryName: string

  @Column('varchar', { name: 'description', nullable: true, length: 1000 })
  description: string | null

  @Column({ type: 'int', name: 'views', unsigned: true })
  @Index('views_idx')
  views: number

  @OneToMany(() => Chapter, (chapters) => chapters.gallery)
  chapters: Chapter[]

  @ManyToMany(() => Tag, (tags) => tags.galleries)
  @JoinTable({
    name: 'galleries_tags',
    joinColumns: [{ name: 'gallery_id', referencedColumnName: 'galleryId' }],
    inverseJoinColumns: [{ name: 'tag_id', referencedColumnName: 'tagId' }]
  })
  tags: Tag[]

  toPlainGallery (): PlainGallery {
    const retval = {
      id: this.galleryId,
      name: this.galleryName,
      views: this.views,
      description: this.description,
      chapters: {},
      tags: {}
    }

    if (this.chapters) {
      this.chapters.map(c => {
        retval.chapters[c.chapterNumber] = { name: c.chapterName, pages: c.pages }
      })
    }

    for (const tag of this.tags) {
      if (retval.tags[tag.type]) {
        retval.tags[tag.type].push(tag.tagName)
      } else {
        retval.tags[tag.type] = [tag.tagName]
      }
    }

    return retval
  }
}
