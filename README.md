# Installing on macOS

If you get a "damaged" or "unidentified developer" error:

1. Download the DMG file
2. Open Terminal
3. Run: xattr -d com.apple.quarantine /path/to/your-app.dmg
4. Double-click the DMG to open normally

```
Failure reason:
  specifiers in the lockfile don't match specifiers in package.json:
* 3 dependencies were removed: @tauri-apps/plugin-fs@~2.4.0, @tauri-apps/plugin-sql@~2.3.0, @tauri-apps/cli@^2.6.2
```

fix with

```
pnpm install --no-frozen-lockfile
```

# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
