// Worker to handle GitHub OAuth only on /auth, and serve static site for all other paths.
const STATE_COOKIE = 'github_oauth_state';

const getCookie = (cookieHeader = '', name) => {
  return cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1];
};

const redirectResponse = (location, cookie) => {
  const headers = { Location: location };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(null, { status: 302, headers });
};

const htmlTokenResponse = (accessToken) => {
  const html = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>GitHub OAuth</title></head>
  <body>
    <script>
      if (window.opener) window.opener.postMessage({ token: ${JSON.stringify(
        accessToken
      )}, provider: 'github' }, '*');
      window.close();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `${STATE_COOKIE}=; Path=/auth; Secure; SameSite=Lax; Max-Age=0`,
      'Cache-Control': 'no-store',
    },
  });
};

async function handleAuth(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const origin = `${url.protocol}//${url.host}`;
  const redirectUri = `${origin}/auth`;

  // Only require GitHub secrets for the /auth flow
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET', { status: 500 });
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const currentState = getCookie(cookieHeader, STATE_COOKIE);

  if (!code) {
    const nextState = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'public_repo');
    authUrl.searchParams.set('state', nextState);
    authUrl.searchParams.set('allow_signup', 'false');

    return redirectResponse(authUrl.toString(), `${STATE_COOKIE}=${nextState}; Path=/auth; Secure; SameSite=Lax; Max-Age=600`);
  }

  if (!state || state !== currentState) {
    return new Response('Invalid or missing OAuth state', { status: 400 });
  }

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      // Worker to handle GitHub OAuth only on /auth, and serve static site for all other paths.
      const STATE_COOKIE = 'github_oauth_state';

      const getCookie = (cookieHeader = '', name) => {
        return cookieHeader
          .split(';')
          .map((c) => c.trim())
          .find((c) => c.startsWith(`${name}=`))
          ?.split('=')[1];
      };

      const redirectResponse = (location, cookie) => {
        const headers = { Location: location };
        if (cookie) headers['Set-Cookie'] = cookie;
        return new Response(null, { status: 302, headers });
      };

      const htmlTokenResponse = (accessToken) => {
        const html = `<!doctype html>
      <html lang="en">
        <head><meta charset="utf-8" /><title>GitHub OAuth</title></head>
        <body>
          <script>
            if (window.opener) window.opener.postMessage({ token: ${JSON.stringify(
              accessToken
            )}, provider: 'github' }, '*');
            window.close();
          </script>
        </body>
      </html>`;

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Set-Cookie': `${STATE_COOKIE}=; Path=/auth; Secure; SameSite=Lax; Max-Age=0`,
            'Cache-Control': 'no-store',
          },
        });
      };

      async function handleAuth(request, env) {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const origin = `${url.protocol}//${url.host}`;
        const redirectUri = `${origin}/auth`;

        // Only require GitHub secrets for the /auth flow
        if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
          return new Response('Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET', { status: 500 });
        }

        const cookieHeader = request.headers.get('cookie') || '';
        const currentState = getCookie(cookieHeader, STATE_COOKIE);

        if (!code) {
          const nextState = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
          const authUrl = new URL('https://github.com/login/oauth/authorize');
          authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
          authUrl.searchParams.set('redirect_uri', redirectUri);
          authUrl.searchParams.set('scope', 'public_repo');
          authUrl.searchParams.set('state', nextState);
          authUrl.searchParams.set('allow_signup', 'false');

          return redirectResponse(authUrl.toString(), `${STATE_COOKIE}=${nextState}; Path=/auth; Secure; SameSite=Lax; Max-Age=600`);
        }

        if (!state || state !== currentState) {
          return new Response('Invalid or missing OAuth state', { status: 400 });
        }

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
        if (!accessToken) return new Response('GitHub OAuth exchange failed', { status: 500 });

        return htmlTokenResponse(accessToken);
      }

      async function serveStatic(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        // Serve admin UI for /admin and subpaths
        if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
          const adminReq = new Request(new URL('/admin/index.html', request.url), request);
          const adminRes = await env.__STATIC_CONTENT.get(adminReq);
          if (adminRes) return adminRes;
          return new Response('Admin not found', { status: 404 });
        }

        // Serve exact asset if present
        const assetPath = pathname === '/' ? '/index.html' : pathname;
        const assetReq = new Request(new URL(assetPath, request.url), request);
        try {
          const assetRes = await env.__STATIC_CONTENT.get(assetReq);
          if (assetRes) return assetRes;
        } catch (err) {
          // ignore and fallthrough to SPA index
        }

        // SPA fallback
        const indexReq = new Request(new URL('/index.html', request.url), request);
        const indexRes = await env.__STATIC_CONTENT.get(indexReq);
        if (indexRes) return indexRes;

        return new Response('Not found', { status: 404 });
      }

      export default {
        async fetch(request, env) {
          const url = new URL(request.url);
          if (url.pathname === '/auth' || url.pathname.startsWith('/auth?') || url.pathname.startsWith('/auth/')) {
            return handleAuth(request, env);
          }
          return serveStatic(request, env);
        },
      };
