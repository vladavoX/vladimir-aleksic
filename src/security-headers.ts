// Baseline security headers for every SSR document. The Worker renders those
// itself, so a `_headers` file cannot reach them — the root route's `headers()`
// in src/routes/__root.tsx returns these and Start merges them into every
// rendered response. Static assets are served by the Cloudflare assets binding
// instead, so `public/_headers` repeats the same list for them; the test beside
// this file fails if the two ever drift apart.
//
// No Content-Security-Policy on purpose: Start injects inline scripts, so an
// enforcing policy needs nonce plumbing, which is its own piece of work.
export const SECURITY_HEADERS: Record<string, string> = {
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
