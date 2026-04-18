// !!! Do not add any imports to this file, as it is used in the preload script and should not have any dependencies on Electron or Node.js APIs.

/** Event channel names that are shared between the renderer and the main process.
 *  **This is different than the event types of Electron. These names are arbitrary.**
 *  @remarks This is safe to import from the preload script. **The frontend application does not need this type, as it will interact with the exposed callback interface only.
 *  */
export const WindowEvent = {
  ENTER_FULLSCREEN: "enter-full-screen",
  EXIT_FULLSCREEN: "exit-full-screen",
  CONTEXT_MENU: "context-menu",
} as const;
