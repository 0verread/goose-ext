import * as vscode from 'vscode';

import SidePanelProvider from './webview/sidepanel-provider';

export async function activate(context: vscode.ExtensionContext) {

	const sidePanelViewProvider = new SidePanelProvider(context);

	context.subscriptions.push(
		vscode.commands.registerCommand('goose.explain', askGooseToExplain),
		vscode.commands.registerCommand('goose.optimize', askGooseToRefactor),
		vscode.commands.registerCommand('goose.setApiKey', resetToken),
		vscode.commands.registerCommand('goose.resetApiKey', resetToken),
		vscode.window.registerWebviewViewProvider("goose-left-panel", sidePanelViewProvider, {
			webviewOptions: { retainContextWhenHidden: true }
		})
	);

	// TODO: more structural. Better prompt.
	async function askGooseToExplain() { await askGoose('Can you explain what this code does?'); }
	async function askGooseToRefactor() { await askGoose('Please refactor the provided code and return the result code only'); }

	// Used to reset API key
	async function resetToken() {
		await context.globalState.update('token', null);
		await context.globalState.update('clearance-token', null);
		await context.globalState.update('user-agent', null);
		await context.globalState.update('chatgpt-api-key', null)
		await sidePanelViewProvider.ensureApiKey();
		// await vscode.window.showInformationMessage("Token reset, you'll be prompted for it next to you next ask a question.");
	}

	async function askGoose(userInput?: string) {
		if (!userInput) {
			userInput = await vscode.window.showInputBox({ prompt: "Ask a question" }) || "";
		}

		let editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectedCode = editor.document.getText(vscode.window.activeTextEditor?.selection);
			const entireFileContents = editor.document.getText();

			const code = selectedCode
				? selectedCode
				: `This is the ${editor.document.languageId} file I'm working on: \n\n${entireFileContents}`;

				sidePanelViewProvider.sendOpenAiApiRequest(userInput, code);
		}
	}

}

// This method is called when your extension is deactivated
export function deactivate() {}
