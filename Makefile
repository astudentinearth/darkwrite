APPDIR = "$HOME/.config/io.github.astudentinearth.darkwrite/"

build:
	@echo "Installing dependencies"
	npm install
	@echo "Parsing CSS"
	npm run twcss_build
	@echo "Building .deb package"
	npm run tauri build

