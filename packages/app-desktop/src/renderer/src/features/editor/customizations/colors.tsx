import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { RotateCcw } from "lucide-react";

export default function ColorsView() {
  return (
    <div className="rounded-2xl bg-view-1 p-2 flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <span className="flex-shrink-0 font-medium">Background color</span>
        <div className="w-full"></div>
        <Input placeholder="Default" className="h-8 w-24" />
        <Button
          className="flex-shrink-0 hover:bg-secondary/50"
          size={"icon32"}
          variant={"outline"}
        >
          <RotateCcw size={18} className="opacity-75" />
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex-shrink-0 font-medium">Default text color</span>
        <div className="w-full"></div>
        <Input placeholder="Default" className="h-8 w-24" />
        <Button
          className="flex-shrink-0 hover:bg-secondary/50"
          size={"icon32"}
          variant={"outline"}
        >
          <RotateCcw size={18} className="opacity-75" />
        </Button>
      </div>
    </div>
  );
}
