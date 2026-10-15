// ============================================================
// Image URL resolver
// ============================================================
//
// The API stores property images as relative paths like
// "/uploads/property/images/xyz.jpg" and serves them statically from the
// API origin (e.g. http://localhost:5000/uploads/...). The website runs on a
// different origin (e.g. http://localhost:5173), so a bare "/uploads/..." src
// resolves against the *site* origin and 404s (broken image icons).
//
// resolveImageUrl() prefixes relative paths with the API origin so images
// load correctly, while leaving absolute/data URLs untouched.

const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

/** Origin of the API server (base URL minus the /api/vX suffix). */
export const API_ORIGIN = API_BASE.replace(/\/api\/v\d+\/?$/, "");

/**
 * Resolve a stored image reference into a fully-qualified, loadable URL.
 * @param {string|null|undefined} src
 * @returns {string}
 */
export function resolveImageUrl(src) {
    if (!src) return "";
    const value = String(src).trim();
    if (!value) return "";
    // Already absolute (http/https) or a data/blob URI — leave as-is.
    if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) {
        return value;
    }
    // Relative path — anchor it to the API origin.
    return `${API_ORIGIN}${value.startsWith("/") ? "" : "/"}${value}`;
}

export default resolveImageUrl;
