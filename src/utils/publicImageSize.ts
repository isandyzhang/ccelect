import path from "node:path";
import sharp from "sharp";

const sizes = new Map<string, Promise<{ width?: number; height?: number }>>();
const publicRoot = path.resolve("public");

/** Public images keep their stable URLs while reserving their intrinsic layout space. */
export function publicImageSize(source?: string) {
  if (!source?.startsWith("/images/")) return undefined;
  const filename = path.resolve(publicRoot, `.${source}`);

  if (!filename.startsWith(`${publicRoot}${path.sep}`)) return undefined;
  if (!sizes.has(filename)) {
    sizes.set(
      filename,
      sharp(filename)
        .metadata()
        .then(({ width, height }) => ({ width, height }))
        .catch(() => ({}))
    );
  }
  return sizes.get(filename);
}
