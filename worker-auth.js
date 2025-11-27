// Basic HTTP Authentication Worker for Merrick Monitor
// Protects merrick-monitor.c9-dev.com with username/password

export default {
  async fetch(request, env) {
    // Credentials - change these to your desired username/password
    const BASIC_USER = env.AUTH_USER || 'admin';
    const BASIC_PASS = env.AUTH_PASS || 'MerrickMonitor2024!';

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

    // Authentication successful - pass request through to origin
    return fetch(request);
  },
};
