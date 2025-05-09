export function getCSP() {
  // Generate a nonce for inline scripts (should be unique per request in production)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  // Define CSP directives with more permissive settings
  const csp = [
    // Default to self
    "default-src 'self'",

    // Allow styles from self, inline styles, and specific domains
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https: data:`,

    // Allow scripts from self, with nonce for inline scripts, and specific domains
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https:`,

    // Allow images from anywhere
    "img-src 'self' data: blob: https: *",

    // Allow fonts from anywhere
    "font-src 'self' data: https://fonts.gstatic.com https: *",

    // Allow connections to anywhere (needed for API calls, etc.)
    "connect-src 'self' https: wss: *",

    // Frame ancestors - restrict to same origin
    "frame-ancestors 'self'",

    // Form actions - allow to self
    "form-action 'self'",

    // Base URI - restrict to self
    "base-uri 'self'",

    // Object sources - restrict
    "object-src 'none'",

    // Media sources - allow from self and https
    "media-src 'self' https: data:",

    // Worker sources - allow from self
    "worker-src 'self' blob:",

    // Manifest sources - allow from self
    "manifest-src 'self'",
  ].join("; ")

  return csp
}
