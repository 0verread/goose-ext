const vscode = require('vscode');


const {getUserInput} =  require('./lib/basics')
const {LeftPanelWebview} = require('./left-panel-webview')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let commnadHelloWorld = vscode.commands.registerCommand('goose.helloWorld', function () {
		var userInput = getUserInput()
		userInput.then((data) => {
			vscode.window.showInformationMessage(`User typed: ${data}`)
		})
	});

	let commandExplainCode = vscode.commands.registerCommand('goose.explain', function () {
		// select code and send to server
		const editor = vscode.window.activeTextEditor;
		var selectedText = editor.document.getText(editor.selection);
		vscode.window.showInformationMessage(`You have selected ${selectedText}`)
	});

	let leftPanelWebview = new LeftPanelWebview();
	let leftPanelView = vscode.window.registerWebviewViewProvider(LEFT_VIEW_PANEL_ID, leftPanelWebview);

	context.subscriptions.push(commnadHelloWorld, commandExplainCode, leftPanelView);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
