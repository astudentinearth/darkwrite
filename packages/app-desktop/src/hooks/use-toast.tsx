import { UpdateToast, UpToDateToast } from "@renderer/components/toast/update-toast";
import { toast } from "sonner";

export const useToast = () => {
  return {
    showUpdateNotification(version: string, url: string) {
      toast.custom(()=><UpdateToast version={version} url={url}/>);
    },

    showNoUpdateNotification(){
      toast.custom(()=><UpToDateToast/>);
    }
  };
};
