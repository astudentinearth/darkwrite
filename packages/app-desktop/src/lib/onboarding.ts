import { ElectronPrefsModel } from "../prefs";
import { _WorkspaceDAO } from "../workspace/workspace.dao";

export async function setDefaultWorkspaceName(name: string) {
  const workspace = (await _WorkspaceDAO.findAll()).at(0);
  if (!workspace) return;
  workspace.name = name;
  await _WorkspaceDAO.save(workspace);
}

export async function setLanguage(lang: string) {
  const prefs = ElectronPrefsModel.get();
  prefs.client.language = lang;
  ElectronPrefsModel.override(prefs);
  ElectronPrefsModel.save();
}
