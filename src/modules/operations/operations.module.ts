import { Module } from '@nestjs/common';
import { SchedulesModule } from './schedules/schedules.module';
import { SeatsModule } from './seats/seats.module';

@Module({
	imports: [SchedulesModule, SeatsModule],
})
export class OperationsModule {}
