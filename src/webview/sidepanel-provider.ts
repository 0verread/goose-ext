import { Configuration, OpenAIApi } from 'openai';
import * as vscode from 'vscode';

import * as dotenv from 'dotenv';

dotenv.config();

export default class SidePanelProvider implements vscode.WebviewViewProvider {
    private webView?: vscode.WebviewView;
    private openAiApi?: OpenAIApi;
    private apiKey?: string;
    private message?: any;

    constructor(private context: vscode.ExtensionContext) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this.webView = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };

        webviewView.webview.html = this.getHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            if (data.type === 'askChatGPT') {
                this.sendOpenAiApiRequest(data.value);
            }
        });

        if (this.message !== null) {
            this.sendMessageToWebView(this.message);
            this.message = null;
        }
    }


    public async ensureApiKey(userApiKey: string) {
        this.apiKey = await this.context.globalState.get('chatgpt-api-key') as string || process.env.OPENAI_API;
        this.context.globalState.update('chatgpt-api-key', this.apiKey);
    }

    public async sendOpenAiApiRequest(prompt: string, code?: string) {
        await this.ensureApiKey();
        if(!code){
            vscode.window.showErrorMessage("No code has been selected");
            return;
        }
        if (!this.openAiApi) {
            try {
                this.openAiApi = new OpenAIApi(new Configuration({ apiKey: this.apiKey }));
            } catch (error: any) {
                vscode.window.showErrorMessage("Failed to connect", error?.message);
                return;
            }
        }

        // Create question by adding prompt prefix to code, if provided
        const question = (code) ? `${prompt}: ${code}` : prompt;

        if (!this.webView) {
            await vscode.commands.executeCommand('chatgpt-vscode-plugin.view.focus');
        } else {
            this.webView?.show?.(true);
        }

        let response: String = '';

        try {
            let currentMessageNumber = this.message;
            let completion;
            try {
                completion = await this.openAiApi.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: question }],
                    n: 1,
                    stop: ['\n\n\n', '<|im_end|>'],
                });
            } catch (error: any) {
                console.log("error: ", error);
                await vscode.window.showErrorMessage("Error sending request", error);
                return;
            }

            if (this.message !== currentMessageNumber) {
                return;
            }

            response = completion?.data.choices[0].message?.content || '';

            const REGEX_CODEBLOCK = new RegExp('\`\`\`', 'g');
            const matches = response.match(REGEX_CODEBLOCK);
            const count = matches ? matches.length : 0;
            if (count % 2 !== 0) {
                response += '\n\`\`\`';
            }
            
            this.sendMessageToWebView({ type: 'addResponse', value: response });
        } catch (error: any) {
            await vscode.window.showErrorMessage("Error sending request to Server", error);
            return;
        }
    }

    public sendMessageToWebView(message: any) {
        if (this.webView) {
            this.webView?.webview.postMessage(message);
        } else {
            this.message = message;
        }
    }

    private getHtml(webview: vscode.Webview) {

        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.css'));

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesMainUri}" rel="stylesheet">
				<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body class="overflow-hidden">
				<div class="flex flex-col h-screen">
					<div class="flex-1 overflow-y-auto" id="qa-list"></div>
				</div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
