import React, { Dispatch, SetStateAction } from "react";
export interface LocaleContextType{
    locale: string,
    setLocale: Dispatch<SetStateAction<string>>
}

export const LocaleContext = React.createContext<LocaleContextType>({locale: "en_us", setLocale: ()=>{return}});

export function GetLocalizedResource(resourceName: string, locale: string){
    /*switch(locale){
        case "en_us":
            return en_us[resourceName];

        case "tr_tr":
            return tr_tr[resourceName];
    
    }*/
    return "";
}