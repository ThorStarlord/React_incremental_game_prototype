/**
 * Resolve an app-root asset path (e.g. '/data/npcs.json') against the build's
 * PUBLIC_URL, so the game also works when hosted under a subpath such as a
 * GitHub Pages project site. PUBLIC_URL is empty for root-hosted builds and
 * tests, where the path is returned unchanged.
 */
export const publicAsset = (rootPath: string): string =>
  `${process.env.PUBLIC_URL ?? ''}${rootPath}`;
