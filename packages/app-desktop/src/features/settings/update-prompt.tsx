// Desktop only.
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@darkwrite/ui";

export default function UpdateDialog(props: {
  update?: Awaited<ReturnType<typeof window.api.settings.checkUpdate>>;
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-96 p-4">
        <DialogTitle className="pt-2 pl-2">Update available</DialogTitle>
        <span className="p-2">
          A new version is available: {props.update?.latest}
        </span>
        <DialogFooter className="flex flex-row [&>button]:shrink-0">
          <DialogClose asChild>
            <Button variant={"ghost"}>Dismiss</Button>
          </DialogClose>
          <Button>Go to release page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
