VERSION := $(shell cat VERSION)

build_apk:
	@echo "Building APK..."
	cd tauriapp && npm run tauri android build -- --apk true && ./sign_apk.sh $(VERSION)
