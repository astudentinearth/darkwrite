export function logTestBegin(msg:string){
    console.log("%c"+msg,"color:cyan");
}

export function logTestFail(msg:string){
    console.log("%c"+msg,"color:red");
}

export function logTestSuccess(msg:string){
    console.log("%c"+msg,"color:green");
}