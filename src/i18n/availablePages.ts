import { getCollection } from "astro:content";
import { locales, localizedHref, pageKeyFromContentId, parseLocaleId } from "./config";
import type { Locale } from "./config";
import { isPublished } from "../utils/published";

export const BLOG_PAGE_SIZE = 8;

/** Match actual output routes, including article, tag and pagination pages. */
export async function alternatePages(pathname: string): Promise<Partial<Record<Locale, string>>> {
  const routes = new Set<string>();
  const pages = await getCollection("pages", isPublished);
  const posts = await getCollection("blog", isPublished);

  for (const page of pages) {
    const { locale, rest } = parseLocaleId(page.id);

    if (rest !== "404" && rest !== "blog")
      routes.add(localizedHref(locale, pageKeyFromContentId(rest)));
  }
  for (const locale of locales) {
    const localizedPosts = posts.filter((post) => parseLocaleId(post.id).locale === locale);
    const addArchive = (key: string, count: number) => {
      for (let index = 1; index <= Math.max(1, Math.ceil(count / BLOG_PAGE_SIZE)); index++) {
        routes.add(localizedHref(locale, index === 1 ? key : `${key}/${index}`));
      }
    };

    addArchive("blog", localizedPosts.length);
    for (const tag of new Set(localizedPosts.map((post) => post.data.tag))) {
      addArchive(
        `blog/tag/${encodeURIComponent(tag)}`,
        localizedPosts.filter((post) => post.data.tag === tag).length
      );
    }
    for (const post of localizedPosts)
      routes.add(localizedHref(locale, `blog/${parseLocaleId(post.id).rest}`));
  }
  const segments = pathname.replace(/^\/+|\/+$/g, "").split("/");

  if (locales.includes(segments[0] as Locale)) segments.shift();
  const key = segments.join("/");

  return Object.fromEntries(
    locales.flatMap((locale) => {
      const href = localizedHref(locale, key);

      return routes.has(href) ? [[locale, href]] : [];
    })
  );
}
