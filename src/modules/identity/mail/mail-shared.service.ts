import { HttpException, Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { ErrorResponse, Resend } from 'resend';
import { SendMailRegisteredDto } from '@/modules/identity/mail/dto';
import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as path from 'path';
import { SendMailDto } from '@/modules/identity/mail/dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailSharedService implements OnModuleInit {
	protected logContext = this.constructor.name;
	private fromEmail: string;
	private toEmail: string;

	constructor(
		@Inject(LIBRARY_TOKENS.RESEND) private readonly resendMail: Resend,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly configService: ConfigService,
	) {}

	onModuleInit() {
		const fromEmailTest = this.configService.get<string>('RESEND_FROM_EMAIL_TEST');
		const toEmailTest = this.configService.get<string>('RESEND_TO_EMAIL_TEST');
		const layoutPath = path.join(process.cwd(), 'templates', 'layout.template.hbs');

		if (!fromEmailTest || !toEmailTest) {
			this.logger.error('RESEND mail is not defined environment variable!', {
				context: this.logContext,
			});

			throw new InternalServerErrorException('Terjadi kesalahan pada sistem!');
		}

		this.fromEmail = fromEmailTest;
		this.toEmail = toEmailTest;

		console.log({ layoutPath });

		if (!fs.existsSync(layoutPath)) {
			this.logger.error('Layout path not found', { context: this.logContext });
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem!');
		}

		const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
		handlebars.registerPartial('layout', layoutSource);
	}

	async sendMail(dto: SendMailDto) {
		const bodyPath = path.join(process.cwd(), 'templates', `${dto.templateName}.hbs`);

		if (!fs.existsSync(bodyPath)) {
			this.logger.error('Path body for template is not defined', {
				context: this.logContext,
				bodyPath: bodyPath,
			});

			throw new InternalServerErrorException('Terjadi kesalahan pada sistem!');
		}

		const bodyResource = fs.readFileSync(bodyPath, 'utf-8');
		const bodyTemplate = handlebars.compile(bodyResource);
		const dataInput = {
			title: dto.subject,
			email: dto.to,
			otpCode: dto.otpCode,
			verificationLink: dto.verificationLink,
		};
		const bodyHtml = bodyTemplate(dataInput);

		try {
			const { data, error } = await this.resendMail.emails.send({
				from: this.fromEmail,
				to: this.toEmail,
				subject: dto.subject,
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
}
