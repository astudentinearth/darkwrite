import { ElectronPrefsModel } from "../prefs";
import { WorkspaceDAO } from "../workspace/workspace.dao";

export async function setDefaultWorkspaceName(name: string) {
  const workspace = (await WorkspaceDAO.findAll()).at(0);
  if (!workspace) return;
  workspace.name = name;
  await WorkspaceDAO.save(workspace);
}

export async function setLanguage(lang: string) {
  const prefs = ElectronPrefsModel.get();
  prefs.client.language = lang;
  ElectronPrefsModel.override(prefs);
  ElectronPrefsModel.save();
}
