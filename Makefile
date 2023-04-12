APPDIR = "$HOME/.config/io.github.astudentinearth.darkwrite/"

build:
	@echo "Installing dependencies"
	npm install
	@echo "Starting build"
	npm run tauri build	

