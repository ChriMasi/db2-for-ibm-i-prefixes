
# SQL Prefixes for IBM i

Estensione per Visual Studio Code che semplifica l’inserimento dei prefissi SQL speciali per DB2 for IBM i. Supporta italiano e inglese.

## Funzionalità
- **Barra di stato**: due pulsanti in basso a sinistra nei file `.sql`:
	- **SQL Prefixes**: scegli tra i prefissi disponibili (`json:`, `csv:`, `sql:`, `rpg:`, `cl:`) e inseriscilo all’inizio della query. Se già presente un altro prefisso, viene sostituito. Se premi lo stesso, viene rimosso.
	- **SQL Update**: inserisce o rimuove il prefisso `update:` per rendere la query updatable.
- **Gestione automatica**: solo un prefisso alla volta, sempre all’inizio della query.
- **Multilingua**: i testi e i messaggi si adattano automaticamente alla lingua dell’editor (italiano o inglese).

## Esempi di utilizzo
```sql
-- Risultato come tabella normale
select * from sample.employee;

-- Risultato come JSON
json: select * from sample.employee;

-- Risultato come CSV
csv: select * from sample.employee;

-- Risultato come SQL insert
sql: select * from sample.employee;

-- Risultato come struttura dati RPG
rpg: select * from sample.employee;

-- Esegui comando CL
cl: dspffd sample/employee

-- Query updatable
update: select * from sample.employee;
```

## Come funziona
1. Apri un file `.sql`.
2. Usa i pulsanti in basso a sinistra per inserire, sostituire o rimuovere i prefissi.
3. La lingua dei messaggi si adatta automaticamente.

## Perché usarla?
- Eviti errori di digitazione dei prefissi.
- Risparmi tempo.
- Esperienza integrata e intuitiva per DB2 for IBM i.

---

# SQL Prefixes for IBM i

VS Code extension to easily insert special SQL prefixes for DB2 for IBM i. Supports Italian and English.

## Features
- **Status bar**: two buttons at the bottom left in `.sql` files:
	- **SQL Prefixes**: choose from available prefixes (`json:`, `csv:`, `sql:`, `rpg:`, `cl:`) and insert it at the beginning of the query. If another prefix is present, it is replaced. If you press the same, it is removed.
	- **SQL Update**: inserts or removes the `update:` prefix to make the query updatable.
- **Automatic management**: only one prefix at a time, always at the beginning of the query.
- **Multilingual**: texts and messages automatically adapt to the editor language (Italian or English).

## Usage examples
```sql
-- Result as normal table
select * from sample.employee;

-- Result as JSON
json: select * from sample.employee;

-- Result as CSV
csv: select * from sample.employee;

-- Result as SQL insert
sql: select * from sample.employee;

-- Result as RPG data structure
rpg: select * from sample.employee;

-- Run CL command
cl: dspffd sample/employee

-- Updatable query
update: select * from sample.employee;
```

## How it works
1. Open a `.sql` file.
2. Use the buttons at the bottom left to insert, replace or remove prefixes.
3. Message language adapts automatically.

## Why use it?
- Avoid typing errors on prefixes.
- Save time.
- Integrated and intuitive experience for DB2 for IBM i.

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
