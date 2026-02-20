import { Reflector } from '@nestjs/core';

export const CookieName = Reflector.createDecorator<string>();
