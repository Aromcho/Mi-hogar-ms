import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgenciesService } from './agencies.service';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { AgenciesController } from './agencies.controller';
import { Agency, AgencySchema } from './schemas/agencies.schema';
import { AgenciesMessageController } from './agencies.message';

@Module({
  imports: [
    DatabaseModule,
     MongooseModule.forFeature([{ name: Agency.name, schema: AgencySchema }]),
  ],
  controllers: [AgenciesController, AgenciesMessageController],
  providers: [AgenciesService],
})
export class AgenciesModule {}
