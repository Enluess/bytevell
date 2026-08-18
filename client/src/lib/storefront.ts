const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  groupSlug: string;
  features: string[] | null;
  prices: Array<{
    id: string;
    billingCycle: string;
    currency: string;
    setupFee: string;
    recurringPrice: string;
  }>;
}

export async function fetchStorefrontProducts(filters: { type?: string, groupSlug?: string }): Promise<StorefrontProduct[]> {
  try {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.groupSlug) queryParams.append('groupSlug', filters.groupSlug);

    const res = await fetch(`${API_URL}/products?${queryParams.toString()}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch products: ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error(`Error fetching storefront products:`, error);
    return [];
  }
}

// Utility to ensure features array/object
export function getProductFeatures(product: StorefrontProduct): { features: any } {
  if (typeof product.features === 'object' && product.features !== null && !Array.isArray(product.features)) {
    return { features: product.features };
  }
  
  if (Array.isArray(product.features) && product.features.length > 0) {
    return { features: product.features };
  }
  
  // Backwards compatibility if they still use description parsing
  if (product.description) {
    try {
      const separator = product.description.includes('|') ? '|' : (product.description.includes(',') ? ',' : '\n');
      const features = product.description.split(separator).map(f => f.trim()).filter(f => f.length > 0);
      return { features };
    } catch(e) {}
  }

  return { features: {} };
}
