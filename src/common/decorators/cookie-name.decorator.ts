import { SetMetadata } from '@nestjs/common';

export const COOKIE_NAME_KEY = 'COOKIE_NAME_KEY';
export const CookieName = (name: string) => SetMetadata(COOKIE_NAME_KEY, name);
