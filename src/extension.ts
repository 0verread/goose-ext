import * as vscode from 'vscode';
import { SidebarProvider } from 'webview/chatview-provider';

export function activate(context: vscode.ExtensionContext) {

	let commandHelloWorld = vscode.commands.registerCommand('goose.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from goose!');
	});

	let commnadExplain = vscode.commands.registerCommand('goose.explain', ()=> {
		const editor = vscode.window.activeTextEditor;
		var selectedText = editor?.document.getText(editor.selection);
		vscode.window.showInformationMessage(`You have selected: ${selectedText}`)
	});

	const sidebarProvider = new SidebarProvider(context.extensionUri)
	const chatView = vscode.window.registerWebviewViewProvider("goose-left-panel", sidebarProvider)
	context.subscriptions.push(commandHelloWorld, commnadExplain, chatView);
}

// This method is called when your extension is deactivated
export function deactivate() {}
