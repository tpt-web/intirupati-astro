async function serveStatic(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Serve admin/index.html for any /admin path to support client-side routing in TinaCMS
  if (pathname === '/admin' || pathname === '/admin/' || pathname.startsWith('/admin/')) {
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (err) {
      // ignore and continue
    }

    const adminReq = new Request(new URL('/admin/index.html', request.url), request);
    return env.ASSETS.fetch(adminReq);
  }

  try {
    return await env.ASSETS.fetch(request);
  } catch (err) {
    return new Response('Not found', { status: 404 });
  }
}

export default {
  async fetch(request, env) {
    return serveStatic(request, env);
  },
};
