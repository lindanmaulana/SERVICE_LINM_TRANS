import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const OauthGoogleSigninSchema = UserBaseSchema.pick({
	email: true,
	name: true,
	provider: true,
	providerId: true,
	avatar: true,
});

export class OauthGoogleSigninDto extends createZodDto(OauthGoogleSigninSchema) {
	static schema = OauthGoogleSigninSchema;
}

export const OauthGoogleSigninResponseSchema = z.object({
	user: UserBaseSchema.omit({
		password: true,
		deletedAt: true,
	}),
	access_token: z.string(),
});

export class OauthGoogleSigninResponseDto extends createZodDto(OauthGoogleSigninResponseSchema) {}
