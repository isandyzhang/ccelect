/** Drafts stay available in the editor/dev server but never enter production output. */
export function isPublished(entry: { data: { draft?: boolean } }): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}
