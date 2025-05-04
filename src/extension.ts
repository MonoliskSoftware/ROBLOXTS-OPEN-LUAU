import * as fs from 'fs';
import { parse } from 'jsonc-parser';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// Register the command
	let disposable = vscode.commands.registerCommand('robloxts-open-luau.openCompiledLuau', async (uri: vscode.Uri) => {
		try {
			// If no URI is provided (e.g., called from command palette), use the active editor
			if (!uri) {
				const activeEditor = vscode.window.activeTextEditor;
				if (!activeEditor) {
					vscode.window.showErrorMessage('No active TypeScript file');
					return;
				}
				uri = activeEditor.document.uri;
			}

			// Get the file path
			const tsFilePath = uri.fsPath;

			// Check if it's a .ts or .tsx file
			if (!tsFilePath.endsWith('.ts') && !tsFilePath.endsWith('.tsx')) {
				vscode.window.showErrorMessage('This command only works with .ts or .tsx files');
				return;
			}

			// Find the project root (where tsconfig.json is located)
			const projectRoot = await findProjectRoot(tsFilePath);
			if (!projectRoot) {
				vscode.window.showErrorMessage('Could not find tsconfig.json in parent directories');
				return;
			}

			// Read tsconfig.json to get outDir and rootDirs
			const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
			const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
			const tsconfig = parse(tsconfigContent);
			const outDir = tsconfig.compilerOptions?.outDir || 'out';
			const rootDirs = tsconfig.compilerOptions?.rootDirs || ['src'];

			// Find which rootDir contains this file
			let relativePath: string | null = null;
			let sourceRootDir: string | null = null;

			for (const rootDir of rootDirs) {
				const fullRootDir = path.join(projectRoot, rootDir);
				if (tsFilePath.startsWith(fullRootDir)) {
					relativePath = path.relative(fullRootDir, tsFilePath);
					sourceRootDir = rootDir;
					break;
				}
			}

			if (!relativePath || !sourceRootDir) {
				// Fallback to checking if it's in a 'src' directory
				const srcPath = path.join(projectRoot, 'src');
				if (tsFilePath.startsWith(srcPath)) {
					relativePath = path.relative(srcPath, tsFilePath);
					sourceRootDir = 'src';
				} else {
					vscode.window.showErrorMessage('File is not in any of the configured root directories');
					return;
				}
			}

			// Handle index.ts/index.tsx -> init.luau conversion
			let luauRelativePath = relativePath;
			const fileName = path.basename(relativePath, path.extname(relativePath));

			if (fileName === 'index') {
				// Replace index.ts/index.tsx with init.luau
				const dir = path.dirname(relativePath);
				const baseName = 'init.luau';
				luauRelativePath = dir === '.' ? baseName : path.join(dir, baseName);
			} else {
				// Convert the extension from .ts/.tsx to .luau
				luauRelativePath = relativePath.replace(/\.(ts|tsx)$/, '.luau');
			}

			// Construct the full path to the compiled Luau file
			// The compiled file structure mirrors the source structure under outDir
			const luauFilePath = path.join(projectRoot, outDir, sourceRootDir, luauRelativePath);

			// Check if the Luau file exists
			if (!fs.existsSync(luauFilePath)) {
				vscode.window.showErrorMessage(`Compiled Luau file not found: ${luauFilePath}`);
				return;
			}

			// Open the Luau file
			const document = await vscode.workspace.openTextDocument(luauFilePath);
			await vscode.window.showTextDocument(document);

		} catch (error) {
			vscode.window.showErrorMessage(`Error opening compiled Luau file: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

async function findProjectRoot(filePath: string): Promise<string | null> {
	let currentDir = path.dirname(filePath);
	const root = path.parse(currentDir).root;

	while (currentDir !== root) {
		const tsconfigPath = path.join(currentDir, 'tsconfig.json');
		if (fs.existsSync(tsconfigPath)) {
			return currentDir;
		}
		currentDir = path.dirname(currentDir);
	}

	return null;
}

export function deactivate() { }