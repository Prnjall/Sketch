export interface Sketch {
  id: string;
  title: string | null;
  tags: string[] | null;
  public_url: string;
  storage_path: string;
  created_at: string;
}

export interface SketchUploadPayload {
  title?: string;
  tags?: string[];
  file: File;
}
