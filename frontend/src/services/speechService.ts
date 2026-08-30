export const transcribeAudio = async (
  audioBlob: Blob
): Promise<string> => {
  const formData = new FormData();

  formData.append('file', audioBlob, 'recording.webm');

  const response = await fetch(
    'http://localhost:8000/transcribe',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Transcription failed');
  }

  const data = await response.json();

  return data.text;
};