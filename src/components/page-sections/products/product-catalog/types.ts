export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface CatalogItem {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  iconName?: string;
  specifications?: string[];
  href?: string;
}
