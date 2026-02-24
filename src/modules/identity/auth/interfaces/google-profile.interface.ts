export interface GoogleProfile {
	id: string;
	displayName: string;
	name: {
		familyName: string;
		givenName: string;
	};
	emails: Array<{
		value: string;
		verified: boolean;
	}>;
	photos: Array<{
		value: string;
	}>;
	provider: string;
	_json: {
		sub: string;
		name: string;
		givenName: string;
		familyName: string;
		picture: string;
		email: string;
		email_verified: boolean;
		locale: string;
	};
}
