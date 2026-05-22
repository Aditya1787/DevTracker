import { env } from './env.js';

export const githubConfig = {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
  callbackUrl: env.GITHUB_CALLBACK_URL,
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userUrl: 'https://api.github.com/user'
};
