import { WebviewViewProvider, Uri, EventEmitter, window } from "vscode";
import Sidebar from "./sidebar/Sidebar";

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

	getNonce = () => {
		let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
	}
	_getHtmlForWebview(webview) {
		const styleResetUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "media", "reset.css")
		);
		const styleVSCodeUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "media", "vscode.css")
		);
		const scriptUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "out", "compiled/sidebar.js")
		);
		const styleMainUri = webview.asWebviewUri(
			Uri.joinPath(this.extensionPath, "out", "compiled/sidebar.css")
		);
		const nonce = getNonce();
		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
			-->
			<meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource
					}; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${styleResetUri}" rel="stylesheet">
			<link href="${styleVSCodeUri}" rel="stylesheet">
							<link href="${styleMainUri}" rel="stylesheet">
							<script nonce="${nonce}">
									const tsvscode = acquireVsCodeApi();
							</script>

		</head>
		<body>
			${                     
				ReactDOMServer.renderToString((
				<Sidebar message={"Tutorial for Left Panel Webview in VSCode extension"}></Sidebar>
			))
			}
			<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
	}
}
