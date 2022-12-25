function AppletBase(props:any){
    return <div className="my-4 bg-secondary p-4 max-w-[800px] rounded-2xl shadow-xl">
        {props.title ? <span className="text-2xl m-4 font-bold block text-default text-center">{props.title}</span> : <></>}
        {props.children}
    </div>
}

export default AppletBase;