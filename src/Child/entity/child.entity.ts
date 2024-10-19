import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ParentEntity } from '../../Parent/entity/parent.entity';

@Entity('tb_child')
export class ChildEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpf: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @ManyToOne(() => ParentEntity, (parent) => parent.fatherOfChildren, {
    nullable: true,
  })
  pai: ParentEntity;

  @ManyToOne(() => ParentEntity, (parent) => parent.fatherOfChildren, {
    nullable: false,
  })
  mae: ParentEntity;
}
