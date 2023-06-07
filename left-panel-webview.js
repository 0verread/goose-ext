const {WebviewViewProvider} = require('vscode')

class LeftPanelWebview extends WebviewViewProvider {

  #_getHtmlForWebview = (webview) => {
    
		return `<html>
              <head>
                  <meta charSet="utf-8"/>
                  <meta http-equiv="Content-Security-Policy" 
                          content="default-src 'none';
                          img-src vscode-resource: https:;
                          font-src ${webview.cspSource};
                          style-src ${webview.cspSource} 'unsafe-inline';
                          script-src 'nonce-${nonce}'
            ;">             

                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="${codiconsUri}" rel="stylesheet" />
                  <link href="${styleUri}" rel="stylesheet">

              </head>
              <body>
                  ${
                      
                      ReactDOMServer.renderToString((
            <LeftPanel message={"Tutorial for Left Panel Webview in VSCode extension"}></LeftPanel>
          ))
                  }
          <script nonce="${nonce}" type="text/javascript" src="${constantUri}"></script>
          <script nonce="${nonce}" src="${scriptUri}"></script>
          </body>
          </html>`;
  }
}