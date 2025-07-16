import { DarkwriteDesktopClientInfo } from "@darkwrite/common";
import { render, screen } from "@testing-library/react";
import * as exports from "@/hooks/query/use-client-info";

const mockClientInfo: DarkwriteDesktopClientInfo = {
  electronVersion: "32",
  isPackaged: false,
  nodeVersion: "20",
  os: "Windows_NT",
  version: "0.2.0-alpha.1",
};

vi.spyOn(exports, "useClientInfo").mockReturnValue(mockClientInfo);

//TODO: Separate dependencies from about component to fix this nonsense
it.skip("should render client info", async () => {
  const { AboutCard } = await import("./about");
  render(<AboutCard />);
  expect(screen.getByText("32", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("false", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("20", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Windows_NT", { exact: false })).toBeInTheDocument();
  expect(
    screen.getByText("0.2.0-alpha.1", { exact: false }),
  ).toBeInTheDocument();
});
