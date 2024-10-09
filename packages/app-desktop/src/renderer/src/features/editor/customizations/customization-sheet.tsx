import { Sheet, SheetContent, SheetTitle } from "@renderer/components/ui/sheet";
import ColorsView from "./colors";
import FontStyleView from "./font-style";

export function CustimzationSheet(props: {
  open: boolean;
  onOpenChange: (boolean) => void;
}) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent className="pt-10 flex flex-col gap-4">
        <SheetTitle className="text-2xl">Customize</SheetTitle>
        <FontStyleView />
        <ColorsView />
      </SheetContent>
    </Sheet>
  );
}
