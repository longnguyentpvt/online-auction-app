export const formatPrice = (price: number): string => {
  return ((price ?? 0) / 100).toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
} ;
