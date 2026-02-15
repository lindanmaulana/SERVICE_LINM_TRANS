import { SetMetadata } from '@nestjs/common';

type ActionResponseMessage = 'GET' | 'UPDATE' | 'CREATE' | 'DELETE' | 'CUSTOM';
export const RESPONSE_MESSAGE_KEY = 'SET_MESSAGE_RESPONSE';
export const ResponseMessage = (message: string, action: ActionResponseMessage) => {
	const finalMessage = {
		GET: `${message} data berhasil diambil`,
		UPDATE: `${message} data berhasil dibuat`,
		CREATE: `${message} data berhasil diperbarui`,
		DELETE: `${message} data berhasil dihapus`,
		CUSTOM: message,
	};

	return SetMetadata(RESPONSE_MESSAGE_KEY, finalMessage[action]);
};
