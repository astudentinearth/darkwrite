
TARGET_DIR="$1"
rm -f $TARGET_DIR/index.ts

for f in $(find $TARGET_DIR -name "*.ts"); do
  module="$(basename -s .ts $f)"
  echo "export * from \"./$module\";" >> $TARGET_DIR/index.ts
done