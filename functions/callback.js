export async function onRequest(context) {
    const { request, env, url } = context;

    // ✅ CORRECT: Get values from environment variables
    const client_id = env.GITHUB_CLIENT_ID;
    const client_secret = env.GITHUB_CLIENT_SECRET;

    // Get the code from GitHub's callback URL
    const code = url.searchParams.get('code');
    
    // Get the origin (https://intirupati.in) dynamically
    const origin = url.origin;

    try {
        // Exchange the code for an access token
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: client_id,
                client_secret: client_secret,
                code: code,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return new Response(JSON.stringify({ error: data.error }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const accessToken = data.access_token;

        // Return HTML that sends the token back to Decap CMS
        const html = `<!DOCTYPE html>
        <html>
        <head><title>Authorizing...</title></head>
        <body>
            <script>
                // Send the token to the Decap CMS window
                window.opener.postMessage({
                    type: 'authorization',
                    data: { access_token: '${accessToken}' }
                }, '${origin}');
                window.close();
            </script>
            <p>Authorization complete. You may close this window.</p>
        </body>
        </html>`;

        return new Response(html, {
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        console.error('OAuth error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
