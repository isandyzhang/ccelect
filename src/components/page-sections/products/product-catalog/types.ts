export interface CatalogItemImage {
  image: string;
  imageAlt?: string;
}

export interface CatalogItem {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  images?: CatalogItemImage[];
  iconName?: string;
  specifications?: string[];
  href?: string;
}
