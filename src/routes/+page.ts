import type { PageLoad } from './$types';
export const load: PageLoad = async ({ data }) => {
	return {
		...data,
		universalMessage: 'hello from universal load function'
	};
};
