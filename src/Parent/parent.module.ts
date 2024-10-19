import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentEntity } from '../Parent/entity/parent.entity';
import { ParentService } from '../Parent/service/parent.service';
import { ParentController } from '../Parent/controller/parent.controller';
import { ChildModule } from 'src/Child/child.module';
import { ParentRepository } from './repository/parent.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentEntity]),
    forwardRef(() => ChildModule),
  ],
  providers: [ParentService, ParentRepository],
  controllers: [ParentController],
  exports: [TypeOrmModule, ParentService, ParentRepository],
})
export class ParentModule {}
