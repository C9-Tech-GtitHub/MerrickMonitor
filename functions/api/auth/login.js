export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { username, password } = await request.json();
        const BASIC_USER = env.AUTH_USER;
        const BASIC_PASS = env.AUTH_PASS;

        if (!BASIC_USER || !BASIC_PASS) {
            return new Response('Server configuration error', { status: 500 });
        }

        if (username === BASIC_USER && password === BASIC_PASS) {
            // Create a simple session cookie
            // In a real app, this should be a signed JWT or similar
            // For now, we'll use a simple base64 of the credentials as the session token
            // This matches the Basic Auth scheme but in a cookie
            const sessionToken = btoa(`${username}:${password}`);

            return new Response(JSON.stringify({ success: true }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`, // 24 hours
                },
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response('Bad Request', { status: 400 });
    }
}
