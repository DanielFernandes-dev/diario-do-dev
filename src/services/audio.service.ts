import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

export const uploadCommentAudio = async (blob: Blob, uid: string): Promise<string> => {
  const mimeType = blob.type || 'audio/webm';
  const extension = mimeType.includes('mp4') ? 'm4a' : 'webm';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const fileRef = ref(storage, `audio/${uid}/${name}`);

  await uploadBytes(fileRef, blob, { contentType: mimeType });
  return getDownloadURL(fileRef);
};

export const deleteAudioIfStored = async (url: string): Promise<void> => {
  if (!url.startsWith('https://firebasestorage.googleapis.com/')) return;
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Melhor esforço: falha ao apagar o arquivo não deve impedir a exclusão do comentário.
  }
};
