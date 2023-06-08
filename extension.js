
// import * as vscode from 'vscode';

// import { LeftPanelWebview } from './left-panel-webview';
// import getUserInput from './lib/basics'
const vscode = require('vscode');
const {LeftPanelView} = require('./left-panel-webview')
const getUserInput = require('./lib/basics')
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

	let leftPanelWebview = new LeftPanelWebview(context.extensionUri);
	let leftPanelView = vscode.window.registerWebviewViewProvider('goose-chatView', leftPanelWebview);

	context.subscriptions.push(commnadHelloWorld, commandExplainCode, leftPanelView);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
