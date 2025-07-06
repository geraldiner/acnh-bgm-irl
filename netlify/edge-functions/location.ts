import type { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, { geo }: Context) => {
	return Response.json(
		{ message: 'Hello from the Netlify edge function', geoData: geo },
		{ status: 200, statusText: 'OK' }
	);
};

export const config: Config = {
	path: '/location'
};
