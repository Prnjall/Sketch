export interface UploadedSketch {
  id: string;
  title: string | null;
  tags: string[] | null;
  public_url: string;
  storage_path: string;
  created_at: string;
}

export interface PhotoEntry {
  id: string; // local unique key
  file: File;
  previewUrl: string;
  title: string;
  tags: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
}
