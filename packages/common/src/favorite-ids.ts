export function cleanFavoriteIds(
  ids: string[],
  existingIds: Set<string>,
): string[] {
  const seen = new Set<string>();
  return ids.filter((id) => {
    if (seen.has(id) || !existingIds.has(id)) return false;
    seen.add(id);
    return true;
  });
}
