export interface ProductSeriesCta {
  text: string;
  href: string;
}

export interface ProductSeriesGalleryItem {
  image: string;
  imageAlt?: string;
  caption?: string;
}

export interface ProductSeriesVideoItem {
  title: string;
  description?: string;
  thumbnail?: string;
  href?: string;
}

export interface ProductSeriesProjectItem {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
}
