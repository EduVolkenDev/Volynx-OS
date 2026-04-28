// PropertyFlow Starter — minimal EN/PT dictionary.
// Add a new key on the same line in both objects to extend.

export type Locale = "en" | "pt";

export const dict: Record<Locale, Record<string, string>> = {
  en: {
    "site.name": "PropertyFlow",
    "site.tagline": "Premium real estate, beautifully presented.",
    "nav.classic": "Classic Grid",
    "nav.magazine": "Magazine",
    "nav.compact": "Compact List",
    "nav.gallery": "Gallery",
    "nav.split": "Split View",
    "nav.masonry": "Masonry",
    "nav.map": "Map",
    "nav.tabbed": "Categories",
    "nav.story": "Story",
    "nav.carousel": "Carousel",
    "filter.all": "All",
    "filter.luxury": "Luxury",
    "filter.premium": "Premium",
    "filter.rental": "Rental",
    "filter.commercial": "Commercial",
    "filter.search_ph": "Search by city, type, or feature...",
    "filter.results": "results",
    "filter.no_results": "No properties match these filters.",
    "card.beds": "beds",
    "card.baths": "baths",
    "card.for_sale": "For sale",
    "card.for_rent": "For rent",
    "card.month": "/ month",
    "card.view": "View details",
    "footer.built_with": "Powered by PropertyFlow",
    "lang.toggle": "PT"
  },
  pt: {
    "site.name": "PropertyFlow",
    "site.tagline": "Imobiliário premium, com apresentação à altura.",
    "nav.classic": "Grade Clássica",
    "nav.magazine": "Revista",
    "nav.compact": "Lista Compacta",
    "nav.gallery": "Galeria",
    "nav.split": "Painel Duplo",
    "nav.masonry": "Mosaico",
    "nav.map": "Mapa",
    "nav.tabbed": "Categorias",
    "nav.story": "História",
    "nav.carousel": "Carrossel",
    "filter.all": "Todos",
    "filter.luxury": "Luxo",
    "filter.premium": "Premium",
    "filter.rental": "Aluguel",
    "filter.commercial": "Comercial",
    "filter.search_ph": "Busca por cidade, tipo ou característica...",
    "filter.results": "resultados",
    "filter.no_results": "Nenhum imóvel encontrado para esses filtros.",
    "card.beds": "quartos",
    "card.baths": "banheiros",
    "card.for_sale": "À venda",
    "card.for_rent": "Aluguel",
    "card.month": "/ mês",
    "card.view": "Ver detalhes",
    "footer.built_with": "Construído com PropertyFlow",
    "lang.toggle": "EN"
  }
};

export function t(locale: Locale, key: string, fallback = ""): string {
  return dict[locale]?.[key] ?? dict.en[key] ?? fallback ?? key;
}
