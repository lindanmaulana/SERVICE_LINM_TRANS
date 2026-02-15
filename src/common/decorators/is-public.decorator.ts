import { SetMetadata } from '@nestjs/common';

export const IsPublicKey = 'IS_PUBLIC';
export const IsPublic = () => SetMetadata(IsPublicKey, true);
