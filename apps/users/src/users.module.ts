import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Property, PropertySchema } from '../../properties/src/schemas/property.schema';
import { Branch, BranchSchema } from './schemas/branch.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersMessageController } from './users.message'; 
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { MessagingModule } from '../../../libs/messaging/src/messaging.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Property.name, schema: PropertySchema },
    ]),
    MessagingModule,
  ],
  controllers: [UsersController, UsersMessageController], 
  providers: [UsersService],
})
export class UsersModule {}
