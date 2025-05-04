# Roblox-TS Open Luau Extension

This VS Code extension allows you to quickly open the compiled Luau file corresponding to a TypeScript/TSX file in a Roblox-TS project.

(This extension was made with [claude](https://claude.ai))

## Features

- Right-click on any `.ts` or `.tsx` file in your Roblox-TS project
- Select "Open Compiled Luau File" from the context menu
- The corresponding compiled `.luau` file will open in the editor
- Supports JSON with Comments (JSONC) format in tsconfig.json files

## Requirements

- Your project must have a `tsconfig.json` file at the project root
- The TypeScript files should be in one of the directories specified in `rootDirs` (if configured) or in the default `src` directory
- The compiled Luau files should be in the output directory specified in your tsconfig (default: `out`)

## How It Works

1. The extension searches for the `tsconfig.json` file starting from the current file's directory and moving up
2. It reads the `outDir` configuration from `tsconfig.json` to determine where compiled files are located (supports JSON with Comments format)
3. It calculates the relative path from the source directory to your TypeScript file
4. It constructs the corresponding path in the output directory with a `.luau` extension
5. It opens the compiled Luau file in the editor

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
│   └── module.ts
├── CORP/
│   └── utils.ts
├── out/
│   ├── CONTACT ONE/
│   │   └── module.luau
│   └── CORP/
│       └── utils.luau
└── tsconfig.json
```

The extension will correctly map source files to their compiled counterparts in the output directory structure.

## Contributing

Feel free to submit issues and pull requests for any improvements or bug fixes.

## License

MIT