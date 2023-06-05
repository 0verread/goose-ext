const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "goose" is now active!');

	let disposable = vscode.commands.registerCommand('goose.helloWorld', function () {

		vscode.window.showInformationMessage('Hello World from goose!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
