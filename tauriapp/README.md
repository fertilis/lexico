# Tauri App for Lexico

## Setup

```bash
➞  cargo create-tauri-app                                                                                                                                                                           [git:master] ✔ 
✔ Project name · tauriapp
✔ Identifier · com.user.lexico
✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm, deno, bun)
✔ Choose your package manager · npm
✔ Choose your UI template · React - (https://react.dev/)
✔ Choose your UI flavor · TypeScript

~/r/misc/lexico 
➞  cd tauriapp                                                                                                                                                                                     [git:master] ✖  
~/r/misc/lexico/tauriapp 
➞  ln -s ../ui/out dist   

npm install
npm install tauri-plugin-store-api 
npm run tauri android init 

npm run tauri icon src-tauri/icons/android-chrome-512x512.png

bash create_sign_key.sh 
```

## Android images


```bash
# List available system images
sdkmanager --list | grep "system-images" 

# Create an AVD with the desired system image
avdmanager create avd  -n tauri_pixel -k "system-images;android-34;google_apis;x86_64"

# Run emulator
emulator -avd tauri_pixel 
```
