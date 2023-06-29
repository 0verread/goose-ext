import * as vscode from 'vscode';
import { SidebarProvider } from './webview/chatview-provider';
import ChatGptViewProvider from './webview/sidepanel-provider';

export async function activate(context: vscode.ExtensionContext) {

	const chatViewProvider = new ChatGptViewProvider(context);

	context.subscriptions.push(
		// vscode.commands.registerCommand('goose.explain', askChatGPT),
		// vscode.commands.registerCommand('chatgpt-vscode-plugin.whyBroken', askGPTWhyBroken),
		vscode.commands.registerCommand('goose.explain', askGPTToExplain),
		vscode.commands.registerCommand('goose.optimize', askGPTToRefactor),
		// vscode.commands.registerCommand('chatgpt-vscode-plugin.addTests', askGPTToAddTests),
		vscode.commands.registerCommand('chatgpt-vscode-plugin.resetToken', resetToken),
		vscode.window.registerWebviewViewProvider("goose-left-panel", chatViewProvider, {
			webviewOptions: { retainContextWhenHidden: true }
		})
	);

	async function askGPTToExplain() { await askChatGPT('Can you explain what this code does?'); }
	// async function askGPTWhyBroken() { await askChatGPT('Why is this code broken?'); }
	async function askGPTToRefactor() { await askChatGPT('Can you refactor this code and explain what\'s changed?'); }
	// async function askGPTToAddTests() { await askChatGPT('Can you add tests for this code?'); }

	async function resetToken() {
		await context.globalState.update('chatgpt-session-token', null);
		await context.globalState.update('chatgpt-clearance-token', null);
		await context.globalState.update('chatgpt-user-agent', null);
		await chatViewProvider.ensureApiKey();
		// await vscode.window.showInformationMessage("Token reset, you'll be prompted for it next to you next ask ChatGPT a question.");
	}

	async function askChatGPT(userInput?: string) {
		if (!userInput) {
			userInput = await vscode.window.showInputBox({ prompt: "Ask ChatGPT a question" }) || "";
		}

		let editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedCode = editor.document.getText(vscode.window.activeTextEditor?.selection);
			const entireFileContents = editor.document.getText();

			const code = selectedCode
				? selectedCode
				: `This is the ${editor.document.languageId} file I'm working on: \n\n${entireFileContents}`;

			chatViewProvider.sendOpenAiApiRequest(userInput, code);
		}
	}


	// const sidebarProvider = new SidebarProvider(context.extensionUri);
	// const chatView = vscode.window.registerWebviewViewProvider("goose-left-panel", sidebarProvider);
	// let commandHelloWorld = vscode.commands.registerCommand('goose.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from goose!');
	// });

	// let commnadExplain = vscode.commands.registerCommand('goose.explain', ()=> {
	// 	const editor = vscode.window.activeTextEditor;
	// 	var selectedText = editor?.document.getText(editor.selection);
	// 	sidebarProvider._view?.webview.postMessage({ type: "onSelectedText", value: selectedText })
	// });

	// let commandOptimize = vscode.commands.registerCommand('goose.optimize', () => {
	// 	const editor  = vscode.window.activeTextEditor;
	// 	var selectedText = editor?.document.getText(editor.selection);
	// 	sidebarProvider._view?.webview.postMessage({type: "onSelectedTextToOptimize", value: selectedText})
	// })


	// context.subscriptions.push(commandHelloWorld, commnadExplain, chatView);
}

// This method is called when your extension is deactivated
export function deactivate() {}
