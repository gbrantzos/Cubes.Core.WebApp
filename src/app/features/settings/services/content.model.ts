export interface StaticContent {
  requestPath: string;
  active: boolean;
  fileSystemPath: string;
  defaultFile: string;
  serveUnknownFileTypes: boolean;
  customContentTypes?: string;
  isNew?: boolean;
}
