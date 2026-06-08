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

export async function onRequest({ request, env }) {
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

  const handleAuth = async (request, env) => {
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
  };

  const serveStatic = async (request, env) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Serve admin UI for /admin and any subpaths under /admin
    if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
      const adminReq = new Request(new URL('/admin/index.html', request.url), request);
      const adminRes = await env.__STATIC_CONTENT.get(adminReq);
      if (adminRes) return adminRes;
      return new Response('Admin not found', { status: 404 });
    }

    // Try to serve the exact asset first
    const assetPath = pathname === '/' ? '/index.html' : pathname;
    const assetReq = new Request(new URL(assetPath, request.url), request);
    try {
      const assetRes = await env.__STATIC_CONTENT.get(assetReq);
      if (assetRes) return assetRes;
    } catch (err) {
      // ignore and fallthrough to SPA index fallback
    }

    // SPA fallback: serve index.html for client-side routes
    const indexReq = new Request(new URL('/index.html', request.url), request);
    const indexRes = await env.__STATIC_CONTENT.get(indexReq);
    if (indexRes) return indexRes;

    return new Response('Not found', { status: 404 });
  };

  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname === '/auth') {
        return handleAuth(request, env);
      }
      return serveStatic(request, env);
    },
  };
