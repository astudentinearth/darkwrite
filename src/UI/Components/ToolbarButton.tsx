/**
     * Returns a toolbar button component
     * Props:
     * float: which way should the component float. e.g. : float-left
     * onClick: click action
     * icon: icon to be shown
     **/
function ToolbarButton(props:any){
    
    return <div className={"toolbar-button " + props.float || "float-left"}
    onClick={props.onClick}>
        <i className={"text-default text-3xl "+props.icon}></i>
    </div>;
}
export default ToolbarButton;