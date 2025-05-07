import { FileError } from 'react-dropzone';

export interface IDropZone {
  name: string;
  maxSize: number; // Bytes
  files: any;
  setFiles: any;
  multiple?: boolean;
  minSize?: number; // Bytes
  maxFiles?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  classes?: string;
  noClick?: boolean;
  noKeyboard?: boolean;
  noDrag?: boolean;
  noDragEventsBubbling?: boolean;
  useFsAccessApi?: boolean;
  hideProgressBar?: boolean;
  reference?: any;
  acceptedImageTypes?: string[]; // .png .apng .avif .gif .jpeg .svg .webp .tif .tiff .heic
  acceptedAudioTypes?: string[]; // .mp3 .mp4 .avi .mov .flv .avchd .m4a .wav .ogg
  acceptedVideoTypes?: string[]; // .mkv .ogv .vtt .mpg .avi .mp4 .mov .wmv .3gp .3g2
  acceptedTextTypes?: string[]; // .pdf .doc .docx .xls .xlsx .txt .htm .html .odt .ods .ppt .pptx .key .pps .ppsx
}

export interface IDocumentWrapper {
  file: File;
  errors: FileError[];
  meta?: any;
}

export interface IDocumentHeader {
  file: File;
  uploaded?: number;
  onDelete: (file: File) => void;
}

export interface IDocumentUploadProgress {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File, meta: any) => void;
  hideProgressBar?: boolean;
}

export interface IDocumentUploadError {
  file: File;
  errors: FileError[];
  onDelete: (file: File) => void;
}

export interface IUploadState {
  progress: number;
  uploaded: number;
}
