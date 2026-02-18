export type LogLevel = "error" | "warn" | "info" | "debug";

export class ClientError extends Error {
  constructor(
    public debugMessage: string,
    public userMessage?: string,
  ) {
    super(debugMessage);
    if (!userMessage) this.userMessage = debugMessage;
  }
}
