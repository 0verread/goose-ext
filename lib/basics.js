import { window } from 'vscode';

const getUserInput = async () => {
    var userInput = await window.showInputBox({
        value: "Testinput"
    })
    return userInput;
}

export default getUserInput;