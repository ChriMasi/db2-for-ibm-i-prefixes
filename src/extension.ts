	// Supporto multilingua
	const locale = vscode.env.language;
	const isItalian = locale.startsWith('it');
	const strings = {
		updateBtn: isItalian ? '$(edit) SQL Update' : '$(edit) SQL Update',
		updateTooltip: isItalian ? "Inserisci update: all’inizio della query" : "Insert update: at the beginning of the query",
		prefissiBtn: isItalian ? '$(list-selection) SQL Prefissi' : '$(list-selection) SQL Prefixes',
		prefissiTooltip: isItalian ? 'Scegli un prefisso da inserire' : 'Choose a prefix to insert',
		notSql: isItalian ? 'Il file attivo non è SQL.' : 'The active file is not SQL.',
		quickPick: isItalian ? 'Scegli un prefisso SQL' : 'Choose a SQL prefix',
		prefixes: isItalian ? [
			{ label: 'json:', description: 'Risultato come JSON' },
			{ label: 'csv:', description: 'Risultato come CSV' },
			{ label: 'sql:', description: 'Risultato come SQL insert' },
			{ label: 'rpg:', description: 'Risultato come struttura dati RPG' },
			{ label: 'cl:', description: 'Esegui comando CL' }
		] : [
			{ label: 'json:', description: 'Result as JSON' },
			{ label: 'csv:', description: 'Result as CSV' },
			{ label: 'sql:', description: 'Result as SQL insert' },
			{ label: 'rpg:', description: 'Result as RPG data structure' },
			{ label: 'cl:', description: 'Run CL command' }
		]
	};
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Prefissi disponibili
	const prefixes = strings.prefixes;

	// Pulsante per update
	const updateStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	updateStatusBar.text = strings.updateBtn;
	updateStatusBar.tooltip = strings.updateTooltip;
	updateStatusBar.command = 'sql-prefixes-for-ibm-i.insertUpdatePrefix';
	context.subscriptions.push(updateStatusBar);

	// Pulsante per lista prefissi
	const prefixStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	prefixStatusBar.text = strings.prefissiBtn;
	prefixStatusBar.tooltip = strings.prefissiTooltip;
	prefixStatusBar.command = 'sql-prefixes-for-ibm-i.showPrefixList';
	context.subscriptions.push(prefixStatusBar);

	// Mostra/nasconde i pulsanti solo su file .sql
	function updateStatusBarVisibility() {
		const editor = vscode.window.activeTextEditor;
		if (editor && editor.document.languageId === 'sql') {
			updateStatusBar.show();
			prefixStatusBar.show();
		} else {
			updateStatusBar.hide();
			prefixStatusBar.hide();
		}
	}
	updateStatusBarVisibility();
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarVisibility));
	context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(updateStatusBarVisibility));

	// Comando: inserisci update:
	context.subscriptions.push(vscode.commands.registerCommand('sql-prefixes-for-ibm-i.insertUpdatePrefix', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		const doc = editor.document;
		if (doc.languageId !== 'sql') {
			vscode.window.showWarningMessage(strings.notSql);
			return;
		}
		const firstLine = doc.lineAt(0);
		const currentPrefix = getCurrentPrefix(firstLine.text);
		if (currentPrefix === 'update:') {
			// Rimuovi il prefisso
			editor.edit(editBuilder => {
				editBuilder.delete(new vscode.Range(0, 0, 0, 'update: '.length));
			});
		} else if (currentPrefix) {
			// Sostituisci il prefisso
			editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(0, 0, 0, currentPrefix.length + 1), 'update: ');
			});
		} else {
			// Inserisci il prefisso
			editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), 'update: ');
			});
		}
	}));

	// Comando: mostra lista prefissi
	context.subscriptions.push(vscode.commands.registerCommand('sql-prefixes-for-ibm-i.showPrefixList', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }
		const doc = editor.document;
		if (doc.languageId !== 'sql') {
			vscode.window.showWarningMessage('Il file attivo non è SQL.');
			return;
		}
		const firstLine = doc.lineAt(0);
		const currentPrefix = getCurrentPrefix(firstLine.text);
	const pick = await vscode.window.showQuickPick(prefixes, { placeHolder: strings.quickPick });
		if (!pick) { return; }
		if (currentPrefix === pick.label) {
			// Rimuovi il prefisso
			editor.edit(editBuilder => {
				editBuilder.delete(new vscode.Range(0, 0, 0, pick.label.length + 1));
			});
		} else if (currentPrefix) {
			// Sostituisci il prefisso
			editor.edit(editBuilder => {
				editBuilder.replace(new vscode.Range(0, 0, 0, currentPrefix.length + 1), pick.label + ' ');
			});
		} else {
			// Inserisci il prefisso
			editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), pick.label + ' ');
			});
		}
	}));

	// Funzione di utilità per trovare il prefisso attuale
	function getCurrentPrefix(line: string): string | undefined {
		const allPrefixes = ['update:', 'json:', 'csv:', 'sql:', 'rpg:', 'cl:'];
		for (const p of allPrefixes) {
			if (line.startsWith(p + ' ')) {
				return p;
			}
		}
		return undefined;
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}
