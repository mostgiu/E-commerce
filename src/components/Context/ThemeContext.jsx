import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();
export const LocaleContext = createContext();

export const translations = {
  en: {
    home: "Home",
    brands: "Brands",
    cart: "Cart",
    wishlist: "Wishlist",
    categories: "Categories",
    products: "Products",
    login: "Login",
    register: "Register",
    logout: "Logout",
    searchProducts: "Search products",
    sortBy: "Sort by",
    featured: "Featured",
    priceLow: "Price: Low to High",
    priceHigh: "Price: High to Low",
    rating: "Top Rated",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    premium: "Luxury edit",
    crafted: "Curated for the modern wardrobe",
    bestseller: "Bestsellers",
    newSeason: "New Season",
    latestDeals: "Latest deals",
    addToCart: "Add to Cart",
    addToWishlist: "Add to Wishlist",
    browseProducts: "Browse products",
    emptyWishlist: "Your wishlist is empty.",
    myWishlist: "My Wishlist",
    items: "items",
    remove: "Remove",
    checkout: "Checkout",
    paymentMethod: "Payment method",
    address: "Address Details",
    phone: "Phone Number",
    city: "City",
    placeOrder: "Place Order",
    processing: "Processing...",
    noProducts: "No products found for this category.",
    categoryCollection: "Category Collection",
    latestPromos: "Latest promos",
    curatedPicks: "Curated picks for you",
    orderSummary: "Order Summary",
    continueShopping: "Continue shopping",
    unitPrice: "Unit price",
    total: "Total",
    yourCart: "Your Cart",
    clearCart: "Clear Cart",
    emptyCart: "Your cart is empty",
    qty: "Qty",
    product: "Product",
  },
  it: {
    home: "Home",
    brands: "Brand",
    cart: "Carrello",
    wishlist: "Preferiti",
    categories: "Categorie",
    products: "Prodotti",
    login: "Accedi",
    register: "Registrati",
    logout: "Esci",
    searchProducts: "Cerca prodotti",
    sortBy: "Ordina per",
    featured: "In evidenza",
    priceLow: "Prezzo: dal più basso",
    priceHigh: "Prezzo: dal più alto",
    rating: "Più votati",
    darkMode: "Tema scuro",
    lightMode: "Tema chiaro",
    premium: "Edit luxury",
    crafted: "Curata per l'armadio moderno",
    bestseller: "I più venduti",
    newSeason: "Nuova stagione",
    latestDeals: "Ultime offerte",
    addToCart: "Aggiungi al carrello",
    addToWishlist: "Aggiungi ai preferiti",
    browseProducts: "Sfoglia i prodotti",
    emptyWishlist: "La tua wishlist è vuota.",
    myWishlist: "I miei preferiti",
    items: "articoli",
    remove: "Rimuovi",
    checkout: "Checkout",
    paymentMethod: "Metodo di pagamento",
    address: "Dettagli indirizzo",
    phone: "Numero di telefono",
    city: "Città",
    placeOrder: "Conferma ordine",
    processing: "Elaborazione...",
    noProducts: "Nessun prodotto trovato per questa categoria.",
    categoryCollection: "Collezione categoria",
    latestPromos: "Ultime promozioni",
    curatedPicks: "Scelte curate per te",
    orderSummary: "Riepilogo ordine",
    continueShopping: "Continua lo shopping",
    unitPrice: "Prezzo unitario",
    total: "Totale",
    yourCart: "Il tuo carrello",
    clearCart: "Svuota carrello",
    emptyCart: "Il tuo carrello è vuoto",
    qty: "Qtà",
    product: "Prodotto",
  },
};

export function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("luxury-theme");
    return stored || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("luxury-theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function LocaleContextProvider({ children }) {
  const [locale, setLocale] = useState(() => localStorage.getItem("luxury-locale") || "en");

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("luxury-locale", locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, translations }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
