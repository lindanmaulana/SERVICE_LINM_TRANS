import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ErrorResponse, Resend } from 'resend';
import type { Logger } from 'winston';
import { CreateMailDto } from './dto/create-mail.dto';
import { SendMailDto, SendMailResponseDto } from './dto/send-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Injectable()
export class MailService {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(LIBRARY_TOKENS.RESEND) private readonly resendMail: Resend,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}
	async sendMail(dto: SendMailDto): Promise<SendMailResponseDto> {
		try {
			const { data, error } = await this.resendMail.emails.send({
				from: dto.from,
				to: dto.to,
				subject: dto.subject,
				text: dto.text,
				html: ``,
			});

			if (error) {
				const err = error as ErrorResponse;

				this.logger.error(`Resend Api Failure, ${err.message}`, {
					name: err.name,
					statusCode: err.statusCode,
					context: this.logContext,
				});

				throw new InternalServerErrorException('Gagal memproses pengiriman email.');
			}

			return data
		} catch (err: unknown) {
			if (err instanceof HttpException) throw err;

			this.logger.error('Sistem Crash: ', err);
			throw new InternalServerErrorException(`Terjadi kesalahan pada sistem`);
		}
	}

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
