import { Module } from '@nestjs/common';
import { BusesModule } from './buses/buses.module';
import { RoutesModule } from './routes/routes.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [UsersModule, BusesModule, RoutesModule],
})
export class MasterDataModule {}
