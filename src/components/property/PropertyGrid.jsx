import { SearchX, Loader2 } from "lucide-react";
import PropertyCard from "./PropertyCard";

// ============================================================
// PropertyGrid
// ============================================================
//
// Renders a responsive grid of PropertyCard components.
// Handles three states: loading (skeletons), empty (no results),
// and populated (with optional "Load More" pagination).
//
// Props:
//   properties        : array of property objects (see PropertyCard for shape)
//   loading            : boolean — true while the initial fetch is in flight
//   loadingMore        : boolean — true while fetching the next page
//   hasMore            : boolean — whether a "Load More" button should show
//   onLoadMore         : () => void
//   wishlist           : array of ids currently wishlisted
//   compareList        : array of ids currently marked for compare
//   onToggleWishlist   : (id) => void | Promise
//   onToggleCompare    : (id) => void
//   onViewDetails      : (id) => void
//   onContactOwner     : (property) => void
//   onShare            : (property) => void
//   emptyTitle         : string — heading shown when properties.length === 0
//   emptyMessage       : string — supporting text for empty state
//   columns            : "3" | "4" — controls the desktop column count (default "3")

export default function PropertyGrid({
    properties = [],
    loading = false,
    loadingMore = false,
    hasMore = false,
    onLoadMore,
    wishlist = [],
    compareList = [],
    onToggleWishlist,
    onToggleCompare,
    onViewDetails,
    onContactOwner,
    onShare,
    emptyTitle = "No properties found",
    emptyMessage = "Try adjusting your filters or search a different location.",
    columns = "3",
}) {
    const gridCols =
        columns === "4"
            ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3";

    // --------------------------------------------------------
    // Loading state — show skeleton cards
    // --------------------------------------------------------
    if (loading) {
        return (
            <div className={`grid grid-cols-1 ${gridCols} gap-5 sm:gap-6`}>
                {Array.from({ length: columns === "4" ? 8 : 6 }).map((_, i) => (
                    <PropertyCard key={`skeleton-${i}`} loading />
                ))}
            </div>
        );
    }

    // --------------------------------------------------------
    // Empty state
    // --------------------------------------------------------
    if (!properties.length) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="w-16 h-16 rounded-full bg-cream-deep flex items-center justify-center mb-5">
                    <SearchX size={28} className="text-stone" />
                </div>
                <h3 className="font-display text-xl text-charcoal-deep font-medium mb-2">
                    {emptyTitle}
                </h3>
                <p className="text-sm text-stone max-w-sm">{emptyMessage}</p>
            </div>
        );
    }

    // --------------------------------------------------------
    // Populated grid
    // --------------------------------------------------------
    return (
        <div>
            <div className={`grid grid-cols-1 ${gridCols} gap-5 sm:gap-6`}>
                {properties.map((property) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        isWishlisted={wishlist.includes(property.id)}
                        isCompared={compareList.includes(property.id)}
                        onToggleWishlist={onToggleWishlist}
                        onToggleCompare={onToggleCompare}
                        onViewDetails={onViewDetails}
                        onContactOwner={onContactOwner}
                        onShare={onShare}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-10">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 bg-white border border-charcoal/10 hover:border-gold text-charcoal-deep font-semibold text-sm rounded-xl px-6 py-3 transition-colors disabled:opacity-60"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Load More Properties"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}