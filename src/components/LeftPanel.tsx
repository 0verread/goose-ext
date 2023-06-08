interface LeftPanelProp {
    message: string
}

function LeftPanel({message}: LeftPanelProp){
    return (
        <div>
            <div>Sidebar panel</div>
            <span>{message}</span>
            <button>Submit</button>
            <button>Send</button>
        </div>
    );
}

export default LeftPanel;