import { Module } from '@nestjs/common';
import { DevelopmentsService } from './developments.service';
import { DevelopmentsController } from './developments.controller';

@Module({
  controllers: [DevelopmentsController],
  providers: [DevelopmentsService],
})
export class DevelopmentsModule {}
