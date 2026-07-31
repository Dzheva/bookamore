type OAuth2Provider = 'google' | 'facebook';

// Spring Security exposes the authorization endpoint at the backend root, not under /api/v1.
// Every environment serves both through the same Nginx origin, so a relative path is enough.
const startOAuth2Login = (provider: OAuth2Provider): void => {
  window.location.href = `/oauth2/authorization/${provider}`;
};

export { startOAuth2Login };
export type { OAuth2Provider };
