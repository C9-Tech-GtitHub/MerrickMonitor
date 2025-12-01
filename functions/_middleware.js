// Pages Functions Middleware for HTTP Basic Authentication
// This automatically protects all routes in your Pages deployment

export async function onRequest(context) {
  const { request, env, next } = context;

  // Credentials - these will be set as environment variables in Cloudflare Pages
  const BASIC_USER = env.AUTH_USER;
  const BASIC_PASS = env.AUTH_PASS;

  if (!BASIC_USER || !BASIC_PASS) {
    return new Response('Server configuration error: Missing authentication credentials', {
      status: 500
    });
  }

  const authorization = request.headers.get('Authorization');

  // Check if Authorization header is present
  if (!authorization) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Merrick Monitor - Secure Area", charset="UTF-8"',
      },
    });
  }

  // Parse the Authorization header
  const [scheme, encoded] = authorization.split(' ');

  // Verify the auth scheme is "Basic"
  if (!encoded || scheme !== 'Basic') {
    return new Response('Malformed authorization header', {
      status: 400
    });
  }

  // Decode the Base64 encoded credentials
  const buffer = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const decoded = new TextDecoder().decode(buffer);
  const [user, pass] = decoded.split(':');

  // Verify credentials
  if (user !== BASIC_USER || pass !== BASIC_PASS) {
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Merrick Monitor - Secure Area", charset="UTF-8"',
      },
    });
  }

  // Authentication successful - continue to the next handler
  return next();
}
