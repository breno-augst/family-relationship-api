import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ChildEntity } from '../../Child/entity/child.entity';

@Entity('tb_parent')
export class ParentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpf: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  relationship: 'pai' | 'mae';

  @OneToMany(() => ChildEntity, (child) => child.pai, { cascade: true })
  fatherOfChildren: ChildEntity[];

  @OneToMany(() => ChildEntity, (child) => child.mae, { cascade: true })
  motherOfChildren: ChildEntity[];
}
