export async function onRequest(context) {
    const { env, url } = context;

    // ✅ CORRECT: Get Client ID from environment variable
    const client_id = env.GITHUB_CLIENT_ID;

    // Build the GitHub authorization URL
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', client_id);
    githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
    githubAuthUrl.searchParams.set('scope', 'repo');
    
    // Optional: Add state for security
    const state = crypto.randomUUID();
    githubAuthUrl.searchParams.set('state', state);

    // Redirect to GitHub for authorization
    return Response.redirect(githubAuthUrl.toString(), 302);
}
