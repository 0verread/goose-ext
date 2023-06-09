interface LeftPanelProp {
    message: string
}

function LeftPanel({message}: LeftPanelProp){
    return (
        <div className='panel-wrapper'>
            <div>
                <h2>Sidebar panel</h2>
            </div>
            <form>
                <span>{message}</span>
            </form>
            <button onClick={() => {
                tsvscode.postMessage({ type: "onInfo", value: "Something"})
            }}>Submit</button>
        </div>
    );
}

export default LeftPanel;