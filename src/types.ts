export interface ContentBlock {
  _component: string;
  [key: string]: unknown;
}

export interface ArticleMetadata {
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | string[] | null;
  tags?: string[] | null;
}

/** 所有頁面共用的 SEO 欄位。 */
export interface SeoMetadata {
  title?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  image?: string | null;
  canonical?: string | null;
  type?: "website" | "article";
  article?: ArticleMetadata | null;
  noindex?: boolean;
}

export interface PageFrontmatter extends SeoMetadata {
  pageSections?: ContentBlock[];
}

export interface SocialLink {
  icon: string;
  link: string;
  label?: string;
}

export interface NavButton {
  text?: string;
  link?: string;
  href?: string;
  [key: string]: unknown;
}

export interface SegmentOption {
  value: string;
  label?: string;
  checked?: boolean;
  icon?: string;
}

export interface ContentSelectorItem {
  title?: string;
  subtext?: string;
  iconName?: string;
  iconColor?: string;
  hashId?: string;
  contentSections?: ContentBlock[];
  _component?: string;
  [key: string]: unknown;
}
