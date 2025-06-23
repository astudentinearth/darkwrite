
TARGET_DIR="$1"
rm -f $TARGET_DIR/index.ts

for f in $(find $TARGET_DIR -name "*.ts"); do
  relpath="${f#$TARGET_DIR/}"
  module="${relpath%.ts}"
  echo "export * from \"./$module\";" >> "$TARGET_DIR/index.ts"
done