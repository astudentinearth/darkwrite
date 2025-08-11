
// We are using string enums here to maintain compatibility with the previous iteration.
export enum FontStyle {
  SANS = "sans",
  SERIF = "serif",
  MONO = "mono",
  CUSTOM = "custom"
}

export interface NoteCustomization {
  font?: FontStyle;
  customFont?: string;
  largeText?: boolean;
  backgroundColor?: string;
  textColor?: string;
  /** This can be an embed ID (format //TODO),  
   * a base64 encoded image (discouraged) or any image that is accessible via a URL. 
   * Replaces the `coverEmbedId` field from the previous iteration.
   * */
  coverImageSource?: string;
  widePage?: boolean;
}

export function getDefaultNoteCustomization(): NoteCustomization {
  return {
    font: FontStyle.SANS,
    largeText: false
  }
}