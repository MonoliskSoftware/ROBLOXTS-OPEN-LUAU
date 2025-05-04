# Roblox-TS Open Luau Extension

This VS Code extension allows you to quickly open the compiled Luau file corresponding to a TypeScript/TSX file in a Roblox-TS project.

## Features

* Right-click on any `.ts` or `.tsx` file in your Roblox-TS project
* Select "Open Compiled Luau File" from the context menu
* The corresponding compiled `.luau` file will open in the editor
* Supports JSON with Comments (JSONC) format in tsconfig.json files
* Available in multiple locations:
  - File Explorer context menu (right-click on files)
  - Editor context menu (right-click in the editor)
  - Editor tab context menu (right-click on the tab)  
  - Command Palette (Ctrl+Shift+P, then search for "Open Compiled Luau File")

## How to Use

1. **From File Explorer**: Right-click on any `.ts` or `.tsx` file and select "Open Compiled Luau File"
2. **From Editor Tab**: Right-click on the tab of an open TypeScript file and select "Open Compiled Luau File"
3. **From Editor**: Right-click inside an open TypeScript file and select "Open Compiled Luau File"
4. **From Command Palette**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac), type "Open Compiled Luau File" and press Enter

The extension will find and open the corresponding compiled `.luau` file.

## Requirements

* Your project must have a `tsconfig.json` file at the project root
* The TypeScript files should be in one of the directories specified in `rootDirs` (if configured) or in the default `src` directory
* The compiled Luau files should be in the output directory specified in your tsconfig (default: `out`)

## How It Works

1. The extension searches for the `tsconfig.json` file starting from the current file's directory and moving up
2. It reads the `outDir` and `rootDirs` configuration from `tsconfig.json` to determine where source and compiled files are located (supports JSON with Comments format)
3. It determines which root directory contains your TypeScript file
4. It calculates the relative path from the root directory to your TypeScript file
5. It constructs the corresponding path in the output directory:
   - For regular files: converts `.ts`/`.tsx` to `.luau`
   - For index files: converts `index.ts`/`index.tsx` to `init.luau`
6. It opens the compiled Luau file in the editor

## Installation from Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Open the project in VS Code
4. Press `F5` to launch the Extension Development Host
5. The extension will be available in the development instance of VS Code

## Building the Extension

To build the extension for distribution:

1. Install `vsce` if you haven't: `npm install -g @vscode/vsce`
2. Run `vsce package` to create a `.vsix` file
3. Install the extension from the VSIX file using the Extensions view in VS Code

## Configuration

The extension works with the standard Roblox-TS project structure and also supports projects with multiple root directories. Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "outDir": "out",
    "rootDirs": ["CORP", "CONTACT ONE"],  // Optional: for multiple source directories
    // ... other options
  }
}
```

The extension supports both simple projects with a single `src` directory and complex projects with multiple root directories as specified in `rootDirs`.

## Example Project Structure

For a project with multiple root directories:

```
[project root]
├── CONTACT ONE/
│   ├── module.ts
│   └── components/
│       └── index.ts
├── CORP/
│   └── utils.ts
├── out/
│   ├── CONTACT ONE/
│   │   ├── module.luau
│   │   └── components/
│   │       └── init.luau
│   └── CORP/
│       └── utils.luau
└── tsconfig.json
```

The extension will correctly map source files to their compiled counterparts in the output directory structure, including the special case where `index.ts`/`index.tsx` files are compiled to `init.luau`.

## Troubleshooting

- Make sure your TypeScript files have been compiled before trying to open the Luau files
- Ensure your project has a proper `tsconfig.json` file with an `outDir` specified
- For projects with multiple source directories, make sure they are listed in the `rootDirs` option in your `tsconfig.json`
- The compiled output structure should mirror your source structure under the `outDir`

## Contributing

Feel free to submit issues and pull requests for any improvements or bug fixes.

## License

MIT