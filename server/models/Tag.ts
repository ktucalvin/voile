import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Gallery } from './Gallery'

@Index('tag_name', ['tagName', 'type'], { unique: true })
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tag_id', unsigned: true })
  tagId: number

  @Column('varchar', { name: 'tag_name', length: 255 })
  tagName: string

  @Column('varchar', { name: 'type', length: 255 })
  type: string

  @ManyToMany(() => Gallery, (galleries) => galleries.tags)
  galleries: Gallery[]
}
