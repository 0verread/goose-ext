const vscode = require('vscode');

const getUserInput = async () => {
    var userInput = await vscode.window.showInputBox({
        value: "Testinput"
    })
    return userInput;
}

module.exports = {getUserInput};