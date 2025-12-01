export async function onRequest(context) {
    const { request } = context;
    const cookieHeader = request.headers.get('Cookie');

    // Check for auth_session cookie
    if (cookieHeader && cookieHeader.includes('auth_session=')) {
        return new Response(JSON.stringify({ authenticated: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
    });
}
