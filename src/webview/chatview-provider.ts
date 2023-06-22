import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

       this._view.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Listen for messages from the Sidebar component and execute action
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onFetchText": {
                    let editor = vscode.window.activeTextEditor;
        
                    if (editor === undefined) {
                        vscode.window.showErrorMessage('No active text editor');
                        return;
                    }
        
                    let text = editor.document.getText(editor.selection);
                    // send message back to the sidebar component
                    this._view?.webview.postMessage({ type: "onSelectedText", value: text });
                    break;
                }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });

    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );
        
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.js")
        );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "scripts", "tailwind.min.js")
        );
        const showdownUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "scripts", "showdown.min.js")
        );
        const microlightUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "scripts", "microlight.min.js")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="Content-Security-Policy" content="img-src https: data:; 
                                        style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="${stylesMainUri}" rel="stylesheet">
                    <link href="${styleResetUri}" rel="stylesheet">
                    <link href="${styleVSCodeUri}" rel="stylesheet">
                    <link href="${styleMainUri}" rel="stylesheet">
                    <link href="${showdownUri}" rel="stylesheet">
                    <link href="${microlightUri}" rel="stylesheet">
                    <script nonce="${nonce}">
                        const tsvscode = acquireVsCodeApi();
                    </script>

                </head>
                <body> 
                    <input class="h-10 w-full text-white bg-stone-700 p-4 text-sm" type="text" id="prompt-input" />

                    <div id="response" class="pt-6 text-sm">
                    </div>

                    <script nonce="${nonce}" src="${scriptUri}"></script>
                </body>
			</html>`;
    }
}


// TODO: Send it to another file
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}