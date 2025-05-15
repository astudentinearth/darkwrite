export interface ImageExtensionConfig {
  saveArrayBuffer: (buffer: ArrayBuffer, fileType: string) => Promise<string>;
  uploadFile: (file: File) => Promise<string>
}