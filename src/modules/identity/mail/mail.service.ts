import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { HttpException, Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ErrorResponse, Resend } from 'resend';
import type { Logger } from 'winston';
import { CreateMailDto } from './dto/create-mail.dto';
import { SendMailDto, SendMailResponseDto } from './dto/send-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { SendMailRegisteredDto } from './dto';

@Injectable()
export class MailService implements OnModuleInit {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(LIBRARY_TOKENS.RESEND) private readonly resendMail: Resend,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	onModuleInit() {
		const layoutPath = path.join(process.cwd(), 'templates/layout.template.hbs');

		if (fs.existsSync(layoutPath)) {
			const layoutSource = fs.readFileSync(layoutPath, 'utf-8');

			handlebars.registerPartial('layout', layoutSource);
		}
	}

	async sendMailRegistered(dto: SendMailRegisteredDto) {
		const fromEmail = process.env.RESEND_FROM_EMAIL;
		if (!fromEmail) {
			this.logger.error('RESEND_FROM_EMAIL is not defined environment variable!', {
				context: this.logContext,
			});
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem!');
		}

		const bodyPath = path.join(__dirname, './templates/register.template.hbs');
		const bodyResource = fs.readFileSync(bodyPath, 'utf-8');

		const bodyTemplate = handlebars.compile(bodyResource);
		const bodyHtml = bodyTemplate({ email: dto.to, otp_code: dto.otpCode, verificationLink: dto.verificationLink });

		try {
			const { data, error } = await this.resendMail.emails.send({
				from: fromEmail,
				to: dto.to,
				subject: 'Konfirmasi Registrasi Akun - LinmTrans',
				html: bodyHtml,
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

			return data;
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
