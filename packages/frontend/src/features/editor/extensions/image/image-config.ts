export interface ImageExtensionConfig {
  saveArrayBuffer: (buffer: File, fileType: string) => Promise<string>;
  uploadFile: (file: File) => Promise<string>;
}
