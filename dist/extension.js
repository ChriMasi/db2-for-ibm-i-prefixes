"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var locale = vscode.env.language;
var isItalian = locale.startsWith("it");
var strings = {
  updateBtn: isItalian ? "$(edit) SQL Update" : "$(edit) SQL Update",
  updateTooltip: isItalian ? "Inserisci update: all\u2019inizio della query" : "Insert update: at the beginning of the query",
  prefissiBtn: isItalian ? "$(list-selection) SQL Prefissi" : "$(list-selection) SQL Prefixes",
  prefissiTooltip: isItalian ? "Scegli un prefisso da inserire" : "Choose a prefix to insert",
  notSql: isItalian ? "Il file attivo non \xE8 SQL." : "The active file is not SQL.",
  quickPick: isItalian ? "Scegli un prefisso SQL" : "Choose a SQL prefix",
  prefixes: isItalian ? [
    { label: "json:", description: "Risultato come JSON" },
    { label: "csv:", description: "Risultato come CSV" },
    { label: "sql:", description: "Risultato come SQL insert" },
    { label: "rpg:", description: "Risultato come struttura dati RPG" },
    { label: "cl:", description: "Esegui comando CL" }
  ] : [
    { label: "json:", description: "Result as JSON" },
    { label: "csv:", description: "Result as CSV" },
    { label: "sql:", description: "Result as SQL insert" },
    { label: "rpg:", description: "Result as RPG data structure" },
    { label: "cl:", description: "Run CL command" }
  ]
};
function activate(context) {
  const prefixes = strings.prefixes;
  const updateStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  updateStatusBar.text = strings.updateBtn;
  updateStatusBar.tooltip = strings.updateTooltip;
  updateStatusBar.command = "sql-prefixes-for-ibm-i.insertUpdatePrefix";
  context.subscriptions.push(updateStatusBar);
  const prefixStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
  prefixStatusBar.text = strings.prefissiBtn;
  prefixStatusBar.tooltip = strings.prefissiTooltip;
  prefixStatusBar.command = "sql-prefixes-for-ibm-i.showPrefixList";
  context.subscriptions.push(prefixStatusBar);
  function updateStatusBarVisibility() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === "sql") {
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
  context.subscriptions.push(vscode.commands.registerCommand("sql-prefixes-for-ibm-i.insertUpdatePrefix", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const doc = editor.document;
    if (doc.languageId !== "sql") {
      vscode.window.showWarningMessage(strings.notSql);
      return;
    }
    const firstLine = doc.lineAt(0);
    const currentPrefix = getCurrentPrefix(firstLine.text);
    if (currentPrefix === "update:") {
      editor.edit((editBuilder) => {
        editBuilder.delete(new vscode.Range(0, 0, 0, "update: ".length));
      });
    } else if (currentPrefix) {
      editor.edit((editBuilder) => {
        editBuilder.replace(new vscode.Range(0, 0, 0, currentPrefix.length + 1), "update: ");
      });
    } else {
      editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), "update: ");
      });
    }
  }));
  context.subscriptions.push(vscode.commands.registerCommand("sql-prefixes-for-ibm-i.showPrefixList", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const doc = editor.document;
    if (doc.languageId !== "sql") {
      vscode.window.showWarningMessage("Il file attivo non \xE8 SQL.");
      return;
    }
    const firstLine = doc.lineAt(0);
    const currentPrefix = getCurrentPrefix(firstLine.text);
    const pick = await vscode.window.showQuickPick(prefixes, { placeHolder: strings.quickPick });
    if (!pick) {
      return;
    }
    if (currentPrefix === pick.label) {
      editor.edit((editBuilder) => {
        editBuilder.delete(new vscode.Range(0, 0, 0, pick.label.length + 1));
      });
    } else if (currentPrefix) {
      editor.edit((editBuilder) => {
        editBuilder.replace(new vscode.Range(0, 0, 0, currentPrefix.length + 1), pick.label + " ");
      });
    } else {
      editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), pick.label + " ");
      });
    }
  }));
  function getCurrentPrefix(line) {
    const allPrefixes = ["update:", "json:", "csv:", "sql:", "rpg:", "cl:"];
    for (const p of allPrefixes) {
      if (line.startsWith(p + " ")) {
        return p;
      }
    }
    return void 0;
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
