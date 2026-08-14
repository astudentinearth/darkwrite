/** @returns true if we are in a Wayland session. false otherwise.
 *  @platform linux
 */
export const isWayland = process.env.XDG_SESSION_TYPE === "wayland";
