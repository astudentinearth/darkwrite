import ReactDOM from "react-dom/client";

// biome-ignore lint/complexity/noStaticOnlyClass: namespace
export class ReactRootContainer {
  static root: ReactDOM.Root;

  static {
    ReactRootContainer.root = ReactDOM.createRoot(
      // biome-ignore lint/style/noNonNullAssertion: if this element does not exist maybe we should just... crash?
      document.getElementById("root")!,
    );
  }
}
