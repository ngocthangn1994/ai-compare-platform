'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CompareButton from '@/components/CompareButton';
import ModelPicker from '@/components/ModelPicker';
import PromptInput from '@/components/PromptInput';
import ResultCard from '@/components/ResultCard';
import { CompareResult } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

type CompareApiResponse = {
  results: CompareResult[];
};

type TranscribeApiResponse = {
  text?: string;
  transcript?: string;
};

export default function ComparePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const canSubmit = useMemo(() => {
    return prompt.trim().length > 0 && !loading && selectedModels.length > 0;
  }, [loading, prompt, selectedModels]);

  const toggleModel = (modelId: string) => {
    setError('');

    setSelectedModels((current) => {
      if (current.includes(modelId)) {
        return current.filter((id) => id !== modelId);
      }

      if (current.length >= 3) {
        setError('You can select up to 3 models only.');
        return current;
      }

      return [...current, modelId];
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setError('');
  };

  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setDocumentFile(file);
    setError('');
  };

  const removeImage = () => {
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeDocument = () => {
    setDocumentFile(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const stopTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      setError('');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.webm');

      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to transcribe audio.');
        throw new Error(message);
      }

      const data = (await response.json()) as TranscribeApiResponse;
      const text = (data.text || data.transcript || '').trim();

      if (!text) {
        throw new Error('Transcription came back empty.');
      }

      setTranscript(text);
      setPrompt((current) => (current.trim() ? `${current}\n${text}` : text));
    } catch (transcribeError) {
      const message =
        transcribeError instanceof Error
          ? transcribeError.message
          : 'Unexpected transcription error.';
      setError(message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError('');

      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Your browser does not support voice recording.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        stopTracks();
        setIsRecording(false);

        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (recordError) {
      stopTracks();
      setIsRecording(false);

      const message =
        recordError instanceof Error
          ? recordError.message
          : 'Could not start recording.';
      setError(message);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCompare = async () => {
    if (!prompt.trim()) {
      setError('Please enter a valid prompt before comparing.');
      return;
    }

    if (selectedModels.length === 0) {
      setError('Please select at least 1 model.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      formData.append('selectedModels', JSON.stringify(selectedModels));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (documentFile) {
        formData.append('document', documentFile);
      }

      if (transcript.trim()) {
        formData.append('transcript', transcript.trim());
      }

      const response = await fetch(`${API_BASE_URL}/compare`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to compare responses.');
        throw new Error(message);
      }

      const data = (await response.json()) as CompareApiResponse;
      setResults(data.results || []);
    } catch (apiError) {
      const message =
        apiError instanceof Error ? apiError.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                AI Comparison Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Compare AI Models
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter one prompt, upload files or images, use voice input, and review
                the answers in a clean side-by-side layout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickStat label="Selected" value={`${selectedModels.length}/3`} />
              <QuickStat label="Files" value={getAttachmentCount(imageFile, documentFile)} />
              <QuickStat label="Results" value={String(results.length)} />
              <QuickStat
                label="Status"
                value={
                  loading
                    ? 'Running'
                    : isRecording
                    ? 'Recording'
                    : isTranscribing
                    ? 'Voice...'
                    : 'Ready'
                }
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Prompt</h2>
            <p className="mt-1 text-sm text-slate-600">
              Write your question once and compare the response quality across models.
            </p>
          </div>

          <div className="space-y-5">
            <PromptInput value={prompt} onChange={setPrompt} />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Attachments & Voice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add an image, PDF/file, or record voice before comparing.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    Add Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => documentInputRef.current?.click()}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                  >
                    Add File / PDF
                  </button>

                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      disabled={isTranscribing}
                      className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isTranscribing ? 'Transcribing...' : 'Start Voice'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                    >
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx,.md"
                onChange={handleDocumentChange}
                className="hidden"
              />

              {(imageFile || documentFile || transcript) && (
                <div className="grid gap-4 md:grid-cols-2">
                  {imageFile && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Image</p>
                          <p className="text-xs text-slate-500">
                            {imageFile.name} • {formatFileSize(imageFile.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeImage}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>

                      {imagePreviewUrl && (
                        <img
                          src={imagePreviewUrl}
                          alt="Selected preview"
                          className="h-44 w-full rounded-2xl border border-slate-200 object-cover"
                        />
                      )}
                    </div>
                  )}

                  {documentFile && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Document</p>
                          <p className="text-xs text-slate-500">
                            {documentFile.name} • {formatFileSize(documentFile.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeDocument}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                        File attached and ready to send with your compare request.
                      </div>
                    </div>
                  )}

                  {transcript && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">
                          Voice Transcript
                        </p>

                        <button
                          type="button"
                          onClick={() => setTranscript('')}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700"
                        >
                          Clear
                        </button>
                      </div>

                      <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                        {transcript}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Model Selection</h3>
                  <p className="text-xs text-slate-500">
                    Choose up to 3 models for side-by-side comparison.
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {selectedModels.length} selected
                </span>
              </div>

              <ModelPicker selectedModels={selectedModels} onToggleModel={toggleModel} />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                {!canSubmit
                  ? 'Add a prompt and select at least one model to start.'
                  : `Ready to compare across ${selectedModels.length} model${
                      selectedModels.length > 1 ? 's' : ''
                    }.`}
              </div>

              <div className="flex items-center gap-3">
                <CompareButton onClick={handleCompare} loading={loading} />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Results
              </h2>
              <p className="text-sm text-slate-600">
                Review answers, compare quality, and identify the strongest response.
              </p>
            </div>

            {results.length > 0 && !loading && (
              <div className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200 shadow-sm">
                {results.length} response{results.length > 1 ? 's' : ''} returned
              </div>
            )}
          </div>

          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                <p className="pt-2 text-sm text-slate-500">
                  Running comparison across selected providers...
                </p>
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="mx-auto max-w-md space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">No results yet</h3>
                <p className="text-sm leading-6 text-slate-600">
                  Submit a prompt to see clean side-by-side AI answers with attachments,
                  voice input, and comparison details.
                </p>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-3">
              {results.map((result) => (
                <ResultCard key={result.modelId} result={result} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getAttachmentCount(imageFile: File | null, documentFile: File | null) {
  return String([imageFile, documentFile].filter(Boolean).length);
}

async function getErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data = await response.json();
    if (typeof data?.message === 'string' && data.message.trim()) {
      return data.message;
    }
    return fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}