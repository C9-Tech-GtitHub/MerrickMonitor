export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { password } = await request.json();
        const AUTH_PASS = env.AUTH_PASS;

        if (!AUTH_PASS) {
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (password === AUTH_PASS) {
            // Create a session cookie
            // In a real app, this should be a signed token or session ID
            // For this simple use case, we'll use a simple value
            const cookieValue = 'authenticated';

            // Set cookie options
            // HttpOnly: Not accessible via JS
            // Secure: Only sent over HTTPS
            // SameSite=Strict: CSRF protection
            // Max-Age: 7 days
            const cookie = `MERRICK_SESSION=${cookieValue}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`;

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookie
                }
            });
        } else {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
