/* =========================================================
   PRODUCT / COLLECTION SEARCH DATA
   Placeholder list so search has something to match against
   before the backend is connected.

   TO REPLACE LATER: swap the array below for a live fetch, e.g.
     fetch('/api/products')
       .then(res => res.json())
       .then(data => { window.BLEGAB_PRODUCTS = data; });

   Each item needs a "name" (matched against what's typed)
   and a "url" (where the person is sent).
   ========================================================= */

window.BLEGAB_PRODUCTS = [
  { name: 'Body Wave Wigs', url: 'shop.html?category=body-wave' },
  { name: 'Bone Straight Wigs', url: 'shop.html?category=bone-straight' },
  { name: 'Deep Wave Wigs', url: 'shop.html?category=deep-wave' },
  { name: 'Highlight Wigs', url: 'shop.html?category=highlight' },
  { name: 'Bob Wigs', url: 'shop.html?category=bob' },
  { name: 'Lace Front Wigs', url: 'shop.html?category=lace-front' },
  { name: 'Full Lace Wigs', url: 'shop.html?category=full-lace' },
  { name: 'HD Lace Wigs', url: 'shop.html?category=hd-lace' },
  { name: 'Custom Wigs', url: 'shop.html?category=custom' }
];