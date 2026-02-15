import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from '@/modules/apps/app.service';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('ip')
	@ResponseMessage('Ip user', 'GET')
	getIp(@Req() req: any) {
		return {
			ipDariRequest: req.ip,
			ipDariHeader: req.headers['x-forwarded-for'],
		};
	}
}
