'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Upload, Trash2, Eye, EyeOff, X, ImagePlus, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { UploadedSketch, PhotoEntry } from '@/types';
import { toast } from 'sonner';



export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [recentSketches, setRecentSketches] = useState<UploadedSketch[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
      if (session) loadRecentSketches();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) loadRecentSketches();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setAuthLoading(false);

    if (error) {
      toast.error(error.message || 'Incorrect credentials');
    } else {
      toast.success('Admin access granted');
      setPassword('');
    }
  };

  const loadRecentSketches = async () => {
    setLoadingRecent(true);
    try {
      const { data, error } = await supabase
        .from('sketches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load sketches');
        return;
      }
      setRecentSketches(data || []);
    } finally {
      setLoadingRecent(false);
    }
  };

  // ── File selection ──────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    const newEntries: PhotoEntry[] = selected.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      title: '',
      tags: '',
      status: 'pending',
    }));

    setPhotos((prev) => [...prev, ...newEntries]);
    // Reset so the same files can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const updateField = (id: string, field: 'title' | 'tags', value: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // ── Upload ──────────────────────────────────────────────────
  const uploadSinglePhoto = async (entry: PhotoEntry): Promise<boolean> => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === entry.id ? { ...p, status: 'uploading' } : p))
    );

    try {
      const fileExt = entry.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const storagePath = `sketches/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sketches')
        .upload(storagePath, entry.file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('sketches')
        .getPublicUrl(storagePath);

      const { error: dbError } = await supabase.from('sketches').insert({
        title: entry.title.trim() || null,
        tags: entry.tags ? entry.tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
        storage_path: storagePath,
        public_url: urlData.publicUrl,
      });

      if (dbError) throw new Error(dbError.message);

      setPhotos((prev) =>
        prev.map((p) => (p.id === entry.id ? { ...p, status: 'done' } : p))
      );
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === entry.id ? { ...p, status: 'error', errorMsg: msg } : p
        )
      );
      return false;
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const pending = photos.filter((p) => p.status === 'pending' || p.status === 'error');
    if (pending.length === 0) {
      toast.error('No photos to upload');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const entry of pending) {
      const ok = await uploadSinglePhoto(entry);
      if (ok) successCount++;
      else failCount++;
    }

    setUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully`);
      // Remove done entries after a short delay so the user sees green ticks
      setTimeout(() => {
        setPhotos((prev) => {
          prev.filter((p) => p.status === 'done').forEach((p) => URL.revokeObjectURL(p.previewUrl));
          return prev.filter((p) => p.status !== 'done');
        });
        loadRecentSketches();
      }, 1200);
    }
    if (failCount > 0) {
      toast.error(`${failCount} photo${failCount > 1 ? 's' : ''} failed — check highlighted items`);
    }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (sketch: UploadedSketch) => {
    if (!confirm('Are you sure you want to delete this sketch?')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('sketches')
        .remove([sketch.storage_path]);

      if (storageError) { toast.error('Failed to delete file'); return; }

      const { error: dbError } = await supabase
        .from('sketches')
        .delete()
        .eq('id', sketch.id);

      if (dbError) { toast.error('Failed to delete record'); return; }

      toast.success('Sketch deleted');
      loadRecentSketches();
    } catch {
      toast.error('Delete error');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
  };

  const pendingCount = photos.filter((p) => p.status === 'pending' || p.status === 'error').length;

  // ── Login screen ────────────────────────────────────────────
  if (authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white/50" size={32} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <div className="flex items-center justify-center mb-6">
              <Lock className="text-white mr-3" size={28} />
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                  autoFocus
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={authLoading}
                className="w-full px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors flex justify-center disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {authLoading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
              </motion.button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">Protected via Supabase Auth</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white">Upload Sketches</h1>
          <motion.button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Logout
          </motion.button>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          className="bg-white/5 border border-white/10 rounded-lg p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleUpload} className="space-y-8">

            {/* Drop zone */}
            <div>
              <label className="block text-white font-semibold mb-3">
                Select Photos
                <span className="ml-2 text-white/40 text-sm font-normal">(you can pick multiple at once)</span>
              </label>
              <div
                className="relative border-2 border-dashed border-white/20 rounded-lg p-8 hover:border-white/40 transition-colors cursor-pointer text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <ImagePlus className="mx-auto mb-3 text-white/60" size={36} />
                <p className="text-white/80">Drag and drop or <span className="underline">click to select</span></p>
                <p className="text-white/40 text-sm mt-2">JPG, PNG, or WEBP · multiple files allowed</p>
              </div>
            </div>

            {/* Per-photo editor */}
            <AnimatePresence initial={false}>
              {photos.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-4 p-4 rounded-lg border transition-colors ${
                    entry.status === 'error'
                      ? 'border-red-500/50 bg-red-500/5'
                      : entry.status === 'done'
                      ? 'border-green-500/40 bg-green-500/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-white/10">
                    <img
                      src={entry.previewUrl}
                      alt={entry.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status overlay */}
                    {entry.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 size={22} className="text-white animate-spin" />
                      </div>
                    )}
                    {entry.status === 'done' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <CheckCircle2 size={22} className="text-green-400" />
                      </div>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white/60 text-xs truncate">{entry.file.name}</p>
                      {entry.status !== 'uploading' && entry.status !== 'done' && (
                        <button
                          type="button"
                          onClick={() => removePhoto(entry.id)}
                          className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={entry.title}
                      onChange={(e) => updateField(entry.id, 'title', e.target.value)}
                      placeholder={`Photo ${idx + 1} title (optional)`}
                      disabled={entry.status === 'uploading' || entry.status === 'done'}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors disabled:opacity-50"
                    />

                    <input
                      type="text"
                      value={entry.tags}
                      onChange={(e) => updateField(entry.id, 'tags', e.target.value)}
                      placeholder="Tags: portrait, nature, abstract…"
                      disabled={entry.status === 'uploading' || entry.status === 'done'}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors disabled:opacity-50"
                    />

                    {entry.status === 'error' && (
                      <p className="text-red-400 text-xs">⚠ {entry.errorMsg || 'Upload failed'}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={uploading || pendingCount === 0}
              className="w-full px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: pendingCount > 0 && !uploading ? 1.02 : 1 }}
              whileTap={{ scale: pendingCount > 0 && !uploading ? 0.98 : 1 }}
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={18} />
                  {pendingCount > 0
                    ? `Upload ${pendingCount} Photo${pendingCount > 1 ? 's' : ''}`
                    : 'Select photos above'}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Recent Sketches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">All Uploads ({recentSketches.length})</h2>

          {loadingRecent ? (
            <p className="text-white/60">Loading…</p>
          ) : recentSketches.length === 0 ? (
            <p className="text-white/60">No sketches uploaded yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentSketches.map((sketch) => (
                <motion.div
                  key={sketch.id}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={sketch.public_url}
                      alt={sketch.title || 'Sketch'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Delete overlay */}
                  <motion.button
                    onClick={() => handleDelete(sketch)}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                    whileHover={{ scale: 1 }}
                  >
                    <Trash2 size={24} className="text-red-500" />
                  </motion.button>

                  {sketch.title && (
                    <p className="text-white/70 text-xs mt-2 truncate">{sketch.title}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
