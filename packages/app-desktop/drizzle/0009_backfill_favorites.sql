UPDATE workspace SET favoriteIds = COALESCE(
  (SELECT json_group_array(id ORDER BY favoriteOrderHint ASC)
   FROM note
   WHERE note.workspaceId = workspace.id
     AND note.isFavorite = true
     AND (note.isTrashed IS NULL OR note.isTrashed = false)),
  '[]'
);