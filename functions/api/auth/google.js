export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { credential } = await request.json();

        if (!credential) {
            return new Response(JSON.stringify({ error: 'No credential provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Decode the JWT credential to get user info
        // The credential is a JWT token from Google
        // Format: header.payload.signature
        const parts = credential.split('.');
        if (parts.length !== 3) {
            return new Response(JSON.stringify({ error: 'Invalid credential format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Decode the payload (base64url)
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

        // Verify the token is from Google (basic check)
        // In production, you should verify the signature with Google's public keys
        if (!payload.email || !payload.sub) {
            return new Response(JSON.stringify({ error: 'Invalid token payload' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // For now, we'll allow any Google account
        // You can add email whitelist here if needed
        // Example: const ALLOWED_EMAILS = ['your-email@gmail.com'];
        // if (!ALLOWED_EMAILS.includes(payload.email)) { return unauthorized }

        // Create session token (similar to regular login)
        // Store user info in the session
        const sessionData = {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub
        };

        const sessionToken = btoa(JSON.stringify(sessionData));

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `auth_session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`, // 24 hours
            },
        });
    } catch (err) {
        console.error('Google auth error:', err);
        return new Response(JSON.stringify({ error: 'Authentication failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
