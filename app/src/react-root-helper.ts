import ReactDOM from "react-dom/client";

export class ReactRootContainer {
  static root: ReactDOM.Root;

  static {
    this.root = ReactDOM.createRoot(document.getElementById("root")!);
  }
}
