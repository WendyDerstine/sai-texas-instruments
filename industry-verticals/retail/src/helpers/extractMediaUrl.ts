// Extracts the media URL from a Sitecore rendering parameter string
// Supports mediaurl="..." or HTML img/Image with src="..."
export function extractMediaUrl(param: string | undefined): string | undefined {
  if (!param) return undefined;
  const mediaUrlPattern = /mediaurl="([^"]*)"/i;
  if (mediaUrlPattern.test(param)) {
    return param.match(mediaUrlPattern)?.[1] || undefined;
  }
  const srcPattern = /\bsrc=["']([^"']+)["']/i;
  const srcMatch = param.match(srcPattern);
  return srcMatch?.[1] || undefined;
}
