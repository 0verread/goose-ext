import * as vscode from 'vscode';
import { SidebarProvider } from './webview/chatview-provider';

export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	const chatView = vscode.window.registerWebviewViewProvider("goose-left-panel", sidebarProvider);
	let commandHelloWorld = vscode.commands.registerCommand('goose.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from goose!');
	});

	let commnadExplain = vscode.commands.registerCommand('goose.explain', ()=> {
		const editor = vscode.window.activeTextEditor;
		var selectedText = editor?.document.getText(editor.selection);
		sidebarProvider._view?.webview.postMessage({ type: "onSelectedText", value: selectedText })
	});

	let commandOptimize = vscode.commands.registerCommand('goose.optimize', () => {
		const editor  = vscode.window.activeTextEditor;
		var selectedText = editor?.document.getText(editor.selection);
		sidebarProvider._view?.webview.postMessage({type: "onSelectedTextToOptimize", value: selectedText})
	})


	context.subscriptions.push(commandHelloWorld, commnadExplain, chatView);
}

// This method is called when your extension is deactivated
export function deactivate() {}
