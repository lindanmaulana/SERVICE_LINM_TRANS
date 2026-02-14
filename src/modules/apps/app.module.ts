import { Module } from '@nestjs/common';
import { AppController } from '@/modules/apps/app.controller';
import { AppService } from '@/modules/apps/app.service';
import { DatabaseModule } from '@/core/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true })],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
