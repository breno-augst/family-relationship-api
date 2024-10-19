import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentEntity } from './Parent/entity/parent.entity';
import { ChildEntity } from './Child/entity/child.entity';
import { ParentModule } from './Parent/parent.module';
import { ChildModule } from './Child/child.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'relacionamento-familiarDB',
      password: 'teste01',
      database: 'relacionamentoDB',
      entities: [ParentEntity, ChildEntity],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ParentModule,
    ChildModule,
  ],
})
export class AppModule {}
