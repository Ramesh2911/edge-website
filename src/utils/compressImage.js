// Client-side image compression before upload.
// Keeps payload small enough to avoid nginx/proxy 413 limits while
// preserving acceptable quality for property photos / floor plans.

const DEFAULTS = {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.82,
    skipBelowBytes: 250 * 1024,
};

function shouldSkip(file, opts) {
    if (!file || typeof file === "string") return true;
    if (!String(file.type || "").startsWith("image/")) return true;
    if (/gif/i.test(file.type || "")) return true;
    if (file.size <= opts.skipBelowBytes) return true;
    return false;
}

/**
 * Compress a single image File → JPEG File (smaller).
 * Falls back to the original file on any failure.
 */
export async function compressImage(file, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    if (shouldSkip(file, opts)) return file;

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
        const scale = Math.min(1, opts.maxWidth / bitmap.width, opts.maxHeight / bitmap.height);
        if (scale >= 1 && file.size < 400 * 1024) {
            bitmap.close?.();
            return file;
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) return file;
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close?.();

        const blob = await new Promise((resolve) => {
            canvas.toBlob(resolve, "image/jpeg", opts.quality);
        });
        if (!blob || blob.size >= file.size) return file;

        const baseName = String(file.name || "image").replace(/\.[^.]+$/, "") || "image";
        return new File([blob], `${baseName}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
        });
    } catch {
        return file;
    } finally {
        try { bitmap?.close?.(); } catch { /* ignore */ }
    }
}

/** Compress an array/iterable of image Files in parallel. */
export async function compressImages(files, options = {}) {
    const list = Array.from(files || []);
    return Promise.all(list.map((f) => compressImage(f, options)));
}

export default compressImages;
