import { WorkspaceDAO } from "@/workspace/workspace.dao";
import { ElectronPrefsModel } from "../prefs";

export async function setDefaultWorkspaceName(name: string) {
  const workspaceDao = new WorkspaceDAO();
  const workspace = (await workspaceDao.findAll()).at(0);
  if (!workspace) return;
  await workspaceDao.update({ id: workspace.id, name });
}

export async function setLanguage(lang: string) {
  const prefs = ElectronPrefsModel.get();
  prefs.client.language = lang;
  ElectronPrefsModel.override(prefs);
  ElectronPrefsModel.save();
}
