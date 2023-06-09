(function () {
    const vscode = acquireVsCodeApi();
    window.addEventListener('message', event => {
        const message = event.data;
        console.log("coming here")
        switch(message.type) {
            case "onInfo":
                console.log("something");
                break;
        }
    });
}());