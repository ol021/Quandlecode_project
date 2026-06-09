// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "quandlecode" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// const disposable = vscode.commands.registerCommand('quandlecode.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from QuandleCode!');
	// });

	console.log("QUANDLECODE ACTIVATED");
	
	const disposable = vscode.commands.registerCommand(
		'quandlecode.openFlowchart',
		() => {

			const panel = vscode.window.createWebviewPanel(
				'flowchart',
				'QuandleCode',
				vscode.ViewColumn.Beside,
				{
					enableScripts: true
				}
			);

			panel.webview.html = getWebviewContent();

			// Send current file immediately if one is open
			const editor = vscode.window.activeTextEditor;

			if (editor) {
				panel.webview.postMessage({
					type: "codeUpdate",
					code: editor.document.getText()
				});
			}

			// Listen for future edits
			const changeListener =
				vscode.workspace.onDidChangeTextDocument(event => {

					panel.webview.postMessage({
						type: "codeUpdate",
						code: event.document.getText()
					});

				});

			// Clean up when panel closes
			panel.onDidDispose(() => {
				changeListener.dispose();
			});
		}
	);

	context.subscriptions.push(disposable);
}

function getWebviewContent(): string {

	return `
	<h1>QuandleCode</h1>

	<pre id="code">Open a file...</pre>

	<script>
		window.addEventListener("message", event => {
			document.getElementById("code").textContent =
				event.data.code;
		});
	</script>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}

