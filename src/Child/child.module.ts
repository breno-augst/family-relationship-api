import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildEntity } from './entity/child.entity';
import { ChildService } from './service/child.service';
import { ChildController } from './controller/child.controller';
import { ParentModule } from 'src/Parent/parent.module';
import { ChildRepository } from './repository/child.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChildEntity]),
    forwardRef(() => ParentModule),
  ],
  providers: [ChildService, ChildRepository],
  controllers: [ChildController],
})
export class ChildModule {}
