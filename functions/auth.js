const stateCookieName = 'github_oauth_state';

const getCookie = (cookieHeader, name) => {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1];
};

const createRedirectResponse = (location, cookie) => {
  const headers = { Location: location };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 302, headers });
};

const createHtmlResponse = (accessToken) => {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>GitHub OAuth</title>
  </head>
  <body>
    <script>
      if (window.opener) {
        window.opener.postMessage({ token: ${JSON.stringify(accessToken)}, provider: 'github' }, '*');
      }
      window.close();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `${stateCookieName}=; Path=/auth; Secure; SameSite=Lax; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const origin = `${url.protocol}//${url.host}`;
    const redirectUri = `${origin}/auth`;
    const cookieHeader = request.headers.get('cookie') || '';
    const currentState = getCookie(cookieHeader, stateCookieName);

    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return new Response('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET', { status: 500 });
    }

    if (!code) {
      const nextState = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      const authUrl = new URL('https://github.com/login/oauth/authorize');
      authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'public_repo');
      authUrl.searchParams.set('state', nextState);
      authUrl.searchParams.set('allow_signup', 'false');

      return createRedirectResponse(authUrl.toString(), `${stateCookieName}=${nextState}; Path=/auth; Secure; SameSite=Lax; Max-Age=600`);
    }

    if (!state || state !== currentState) {
      return new Response('Invalid or missing OAuth state', { status: 400 });
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new Response('GitHub OAuth exchange failed', { status: 500 });
    }

    return createHtmlResponse(accessToken);
  },
};
