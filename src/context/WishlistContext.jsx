import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import propertyService from "../services/property.service";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const toIds = (rows) =>
    (Array.isArray(rows) ? rows : [])
        .map((row) => Number(row?.id))
        .filter((id) => Number.isFinite(id));

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [ids, setIds] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [busyIds, setBusyIds] = useState(() => new Set());

    // Refs keep toggle() free of stale closures during rapid clicks.
    const idsRef = useRef(ids);
    const busyRef = useRef(busyIds);

    useEffect(() => {
        idsRef.current = ids;
    }, [ids]);

    useEffect(() => {
        busyRef.current = busyIds;
    }, [busyIds]);

    // Seed / reset the wishlist whenever auth state changes.
    useEffect(() => {
        let alive = true;

        if (!isAuthenticated) {
            idsRef.current = [];
            setIds([]);
            setLoaded(true);
            return () => {
                alive = false;
            };
        }

        setLoaded(false);
        propertyService
            .getWishlist()
            .then((res) => {
                if (!alive) return;
                const rows = res?.data?.data ?? res?.data ?? [];
                const seeded = toIds(rows);
                idsRef.current = seeded;
                setIds(seeded);
            })
            .catch(() => {
                if (!alive) return;
                idsRef.current = [];
                setIds([]);
            })
            .finally(() => {
                if (alive) setLoaded(true);
            });

        return () => {
            alive = false;
        };
    }, [isAuthenticated]);

    const isWishlisted = useCallback(
        (propertyId) => {
            const id = Number(propertyId);
            return Number.isFinite(id) && ids.includes(id);
        },
        [ids]
    );

    const toggle = useCallback(
        async (propertyId, options = {}) => {
            const { silent = false } = options;
            const id = Number(propertyId);
            if (!Number.isFinite(id)) return false;

            // Not signed in → move to login, come back to the same page.
            if (!isAuthenticated) {
                const back = `${location.pathname}${location.search}`;
                navigate(`/login?redirect=${encodeURIComponent(back)}`);
                return false;
            }

            if (busyRef.current.has(id)) return false;

            const had = idsRef.current.includes(id);
            setBusyIds((prev) => new Set(prev).add(id));

            const nextIds = had
                ? idsRef.current.filter((x) => x !== id)
                : [...idsRef.current, id];
            idsRef.current = nextIds; // keep refs in sync before the re-render
            setIds(nextIds);

            try {
                if (had) await propertyService.removeWishlist(id);
                else await propertyService.addWishlist(id);
                if (!silent) toast.success(had ? "Removed from wishlist" : "Saved to wishlist");
                return true;
            } catch (err) {
                // Roll back the optimistic flip.
                idsRef.current = had
                    ? idsRef.current.includes(id)
                        ? idsRef.current
                        : [...idsRef.current, id]
                    : idsRef.current.filter((x) => x !== id);
                setIds(idsRef.current);
                if (!silent) {
                    toast.error(
                        err?.response?.data?.message ||
                            "Could not update wishlist. Please try again."
                    );
                }
                return false;
            } finally {
                setBusyIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }
        },
        [isAuthenticated, location.pathname, location.search, navigate]
    );

    const value = useMemo(
        () => ({
            ids,
            loaded,
            count: ids.length,
            isWishlisted,
            toggle,
        }),
        [ids, loaded, isWishlisted, toggle]
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
