import * as path from 'path';

export const loadFile = (dirr: string) => {
	const resourcePath = path.join(__dirname, dirr);

	return resourcePath;
};
