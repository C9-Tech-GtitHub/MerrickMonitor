// Pages Functions Middleware for HTTP Basic Authentication
// This automatically protects all routes in your Pages deployment

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Allow public assets and login endpoint
  // We allow the root path '/' so the SPA can load and show the Login component
  if (
    url.pathname === "/api/auth/login" ||
    url.pathname === "/api/auth/logout" ||
    url.pathname === "/api/auth/google" ||
    url.pathname === "/" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|ico|svg|json|woff|woff2|ttf|eot)$/,
    )
  ) {
    return next();
  }

  // Check for auth cookie
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader);
  const authSession = cookies["auth_session"];

  if (!authSession) {
    // For API requests, return 401
    if (url.pathname.startsWith("/api/")) {
      return new Response("Authentication required", { status: 401 });
    }
    // For other requests (e.g. deep links), we might want to redirect to /
    // But since it's a SPA, we usually just let the client handle it or redirect to root
    return Response.redirect(url.origin, 302);
  }

  // Verify credentials from cookie
  // Session can be either username:password format or Google OAuth user data (JSON)
  try {
    const decoded = atob(authSession);

    // Try to parse as JSON (Google OAuth session)
    try {
      const sessionData = JSON.parse(decoded);
      // Valid Google OAuth session if it has email and sub
      if (sessionData.email && sessionData.sub) {
        return next();
      }
    } catch (jsonError) {
      // Not JSON, try username:password format
      const [user, pass] = decoded.split(":");

      if (user !== env.AUTH_USER || pass !== env.AUTH_PASS) {
        throw new Error("Invalid credentials");
      }
    }
  } catch (e) {
    // Invalid cookie
    return new Response("Invalid session", {
      status: 401,
      headers: {
        "Set-Cookie": `auth_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      },
    });
  }

  // Authentication successful
  return next();
}

function parseCookies(header) {
  const list = {};
  if (!header) return list;
  header.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    list[parts.shift().trim()] = decodeURI(parts.join("="));
  });
  return list;
}
