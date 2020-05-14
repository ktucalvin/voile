import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Gallery } from './Gallery'

@Index('gallery_id', ['galleryId'], {})
@Entity('chapters')
export class Chapter {
  @Column('int', { primary: true, name: 'gallery_id', unsigned: true })
  galleryId: number

  @Column('varchar', { primary: true, name: 'chapter_number', length: 6 })
  chapterNumber: string

  @Column('int', { name: 'pages', unsigned: true })
  pages: number

  @Column('varchar', { name: 'chapter_name', nullable: true, length: 255 })
  chapterName: string | null

  @ManyToOne(() => Gallery, (galleries) => galleries.chapters, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'gallery_id', referencedColumnName: 'galleryId' }])
  gallery: Gallery
}
