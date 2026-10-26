import { useState, useEffect } from "react";
import contentService from "../services/content.service";

// Module-level cache: all pages share one GET /content request
let cache = null;
let pending = null;

const load = () => {
    if (cache) return Promise.resolve(cache);
    if (!pending) {
        pending = contentService
            .getContent()
            .then((res) => {
                cache = res?.data?.data || {};
                return cache;
            })
            .catch(() => {
                pending = null; // allow retry on next mount
                return {};
            });
    }
    return pending;
};

/**
 * Page content (about_*, contact_* keys) from the admin panel.
 * Returns {} until loaded — callers should use their own fallback text.
 */
export default function usePageContent() {
    const [data, setData] = useState(cache || {});

    useEffect(() => {
        let alive = true;
        load().then((d) => {
            if (alive) setData(d);
        });
        return () => {
            alive = false;
        };
    }, []);

    return data;
}
