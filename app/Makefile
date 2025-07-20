
clean:
	rm -r dist-electron dist

all:
	pnpm install
	pnpm electron-rebuild -f -w better-sqlite3
	node ./darkwrite-builder.js