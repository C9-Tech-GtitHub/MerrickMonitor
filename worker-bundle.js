// Basic HTTP Authentication Worker for Merrick Monitor
export default {
  async fetch(request, env) {
    const BASIC_USER = 'admin';
    const BASIC_PASS = 'MerrickMonitor2024!';
    
    const authorization = request.headers.get('Authorization');
    
    if (!authorization) {
      return new Response('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Merrick Monitor", charset="UTF-8"',
        },
      });
    }
    
    const [scheme, encoded] = authorization.split(' ');
    
    if (!encoded || scheme !== 'Basic') {
      return new Response('Malformed authorization header', { status: 400 });
    }
    
    const buffer = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(buffer);
    const [user, pass] = decoded.split(':');
    
    if (user !== BASIC_USER || pass !== BASIC_PASS) {
      return new Response('Invalid credentials', { 
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Merrick Monitor", charset="UTF-8"',
        },
      });
    }
    
    return fetch(request);
  },
};
