import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from '@/modules/apps/app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('ip')
	getIp(@Req() req: any) {
		return {
			ipDariRequest: req.ip,
			ipDariHeader: req.headers['x-forwarded-for'],
		};
	}
}
