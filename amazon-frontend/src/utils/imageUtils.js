
/**
 * Fixes image URLs that point to the wrong localhost port or are missing.
 * @param {string} url - The image URL from the backend.
 * @returns {string} - The corrected URL.
 */
export const fixImageUrl = (url) => {
    if (!url) return '';

    // If it's already a correct relative path or external URL that works, return it.
    // But here we specifically want to catch the bad localhost URLs.

    if (url.includes('localhost:18308')) {
        // Extract the part after /gems/
        const parts = url.split('/gems/');
        if (parts.length > 1) {
            // Return relative path which will be served from public/gems
            // Note: in React public folder, /gems/foo.jpg is accessible at /gems/foo.jpg
            return `/gems/${parts[1]}`;
        }
    }

    // Handle cases where the URL might be just the filename or other formats if necessary
    // For now, trust other URLs
    return url;
};

export const getProductImage = (product) => {
    if (!product) return '';
    if (product.primary_image) {
        return fixImageUrl(product.primary_image);
    }
    if (product.image_url) {
        return fixImageUrl(product.image_url);
    }
    // Fallback?
    return 'https://m.media-amazon.com/images/I/71p-tHQ0u1L._AC_SX679_.jpg'; // Generic placeholder
};
