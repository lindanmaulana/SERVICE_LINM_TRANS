import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Resend } from 'resend';
import type { Logger } from 'winston';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Injectable()
export class MailService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(LIBRARY_TOKENS.RESEND) private readonly resendMail: Resend,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	create(createMailDto: CreateMailDto) {
		return 'This action adds a new mail';
	}

	findAll() {
		return `This action returns all mail`;
	}

	findOne(id: number) {
		return `This action returns a #${id} mail`;
	}

	update(id: number, updateMailDto: UpdateMailDto) {
		return `This action updates a #${id} mail`;
	}

	remove(id: number) {
		return `This action removes a #${id} mail`;
	}
}
