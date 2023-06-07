const { WebviewViewProvider, WebviewView, Webview, Uri, EventEmitter, window } = require("vscode");

export class LeftPanelWebview extends WebviewViewProvider {
	constructor(extensionPath, data, _view = null) {
		super();
		this.extensionPath = extensionPath;
		this.data = data;
		this._view = _view;
		this.onDidChangeTreeData = new EventEmitter();
	}

	refresh(context) {
		this.onDidChangeTreeData.fire(null);
		this._view.webview.html = this._getHtmlForWebview(this._view?.webview);
	}

	resolveWebviewView(webviewView) {
		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this.extensionPath],
		};
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
		this._view = webviewView;
		this.activateMessageListener();
	}

	activateMessageListener() {
		this._view.webview.onDidReceiveMessage((message) => {
			switch (message.action) {
				case 'SHOW_WARNING_LOG':
					window.showWarningMessage(message.data.message);
					break;
				default:
					break;
			}
		});
	}

	_getHtmlForWebview(webview) {
		const scriptUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "left-webview-provider.js")
		);
		const constantUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "constant.js")
		);
		const styleUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "left-webview-provider.css")
		);
		const codiconsUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "script", "codicon.css")
		);

		return `<html>
                <head>
                    <meta charSet="utf-8"/>
                    <meta http-equiv="Content-Security-Policy" 
                            content="default-src 'none';
                            img-src vscode-resource: https:;
                            font-src ${webview.cspSource};
                            style-src ${webview.cspSource} 'unsafe-inline';
							
							;">             

                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="${codiconsUri}" rel="stylesheet" />
                    <link href="${styleUri}" rel="stylesheet">

                </head>
                <body>
				</body>
            </html>`;
	}
}
