VERSION := $(shell cat VERSION)

build_apk:
	@echo "Building APK..."
	cd tauriapp && npm install && npm run tauri android build -- --apk true && ./sign_apk.sh $(VERSION)
	

clean:
	cd tauriapp && rm node_modules -rf && rm src-tauri/target -rf && rm src-tauri/gen -rf
	cd ui && rm node_modules -rf && rm .next -rf && rm out -rf
