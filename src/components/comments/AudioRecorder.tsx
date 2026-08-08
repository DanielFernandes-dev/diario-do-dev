import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Square, Trash2, Loader2, Volume2 } from 'lucide-react';
import { t } from '@/i18n';
import { useAuth } from '@/context/AuthContext';
import { MAX_AUDIO_BYTES, uploadCommentAudio } from '@/services/audio.service';
import { registerAudioPlayer } from '@/utils/audioPlayer';

interface AudioRecorderProps {
  onAudioChange: (audioUrl: string | null) => void;
}

const MAX_DURATION_SECONDS = 300;

const getPreferredMimeType = (): string => {
  if (typeof window.MediaRecorder === 'undefined') return '';
  // audio/mp4 (AAC) toca em qualquer aparelho (incluindo iPhone/iOS); webm/opus é o padrão do WhatsApp.
  const candidates = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
  return candidates.find((type) => window.MediaRecorder.isTypeSupported(type)) ?? '';
};

export function AudioRecorder({ onAudioChange }: AudioRecorderProps) {
  const { currentUser } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blobTypeRef = useRef('audio/webm');
  const onAudioChangeRef = useRef(onAudioChange);
  onAudioChangeRef.current = onAudioChange;

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

   const reset = () => {
     stopTimer();
     cleanupStream();
     mediaRecorderRef.current = null;
     chunksRef.current = [];
     setElapsed(0);
     setIsRecording(false);
     // Revoke blob URL if it exists
     if (audioUrl && audioUrl.startsWith('blob:')) {
       try {
         URL.revokeObjectURL(audioUrl);
       } catch (e) {
         console.warn('Failed to revoke blob URL:', e);
       }
     }
   };

  useEffect(() => {
    return () => {
      stopTimer();
      cleanupStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

   const handleRecordingStop = async () => {
     stopTimer();
     setIsRecording(false);
     const blob = new Blob(chunksRef.current, { type: blobTypeRef.current });
     chunksRef.current = [];

     if (blob.size === 0) {
       setIsProcessing(false);
       setError(t('comments.audio.empty'));
       return;
     }

     if (blob.size > MAX_AUDIO_BYTES) {
       setIsProcessing(false);
       setError(t('comments.audio.too_large'));
       return;
     }

     // Create blob URL for immediate playback while uploading in background
     const blobUrl = URL.createObjectURL(blob);
     setAudioUrl(blobUrl);
     onAudioChangeRef.current(blobUrl);

     try {
       const url = await uploadCommentAudio(blob, currentUser?.uid ?? 'anonymous');
       // Update with the permanent download URL when upload completes
       setAudioUrl(url);
       onAudioChangeRef.current(url);
       // Revoke the blob URL as it's no longer needed
       URL.revokeObjectURL(blobUrl);
       setError(null);
     } catch {
       // Keep the blob URL available even if upload fails
       setError(t('comments.audio.upload_failed'));
     } finally {
       setIsProcessing(false);
     }
   };

  const startRecording = async () => {
    if (typeof window.MediaRecorder === 'undefined') {
      setError(t('comments.audio.unsupported'));
      return;
    }
    setError(null);
    setAudioUrl(null);
    onAudioChangeRef.current(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getPreferredMimeType();
      blobTypeRef.current = mimeType || 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, {
        ...(mimeType ? { mimeType } : {}),
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= MAX_DURATION_SECONDS) {
            stopRecording();
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      cleanupStream();
      setError(t('comments.audio.denied'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
    } else {
      reset();
    }
  };

   const discard = () => {
     reset();
     setAudioUrl(null);
     setError(null);
     onAudioChangeRef.current(null);
   };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {error && <p className="text-xs text-red-400">{error}</p>}

      {!audioUrl && !isRecording && (
        <button
          type="button"
          onClick={startRecording}
          disabled={isProcessing}
          title={t('comments.audio.record')}
          className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-ink-400/40 hover:bg-ink-500/10 hover:text-ink-200 disabled:opacity-50"
        >
          <Mic className="h-3.5 w-3.5" />
          {t('comments.audio.record')}
        </button>
      )}

      {isRecording && (
        <>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            {formatTime(elapsed)} / {formatTime(MAX_DURATION_SECONDS)}
          </span>
          <button
            type="button"
            onClick={stopRecording}
            disabled={isProcessing}
            title={t('comments.audio.stop')}
            className="flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            <Square className="h-3.5 w-3.5" />
            {isProcessing ? t('comments.audio.processing') : t('comments.audio.stop')}
          </button>
        </>
      )}

      {!audioUrl && !isRecording && !error && (
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Volume2 className="h-3.5 w-3.5" />
          {t('comments.audio.hint')}
        </span>
      )}

      {isProcessing && !audioUrl && (
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t('comments.audio.processing')}
        </span>
      )}

      {audioUrl && (
        <>
          <audio
            controls
            src={audioUrl}
            ref={registerAudioPlayer}
            className="h-9 max-w-full"
          />
          <button
            type="button"
            onClick={discard}
            title={t('comments.audio.discard')}
            className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('comments.audio.discard')}
          </button>
        </>
      )}
    </div>
  );
}
