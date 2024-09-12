// transcript.js
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();

async function transcribeVideo(videoUrl) {
  const audio = await fetchAudioFromVideo(videoUrl); // You need a function to extract audio from the video

  const audioBytes = audio.toString("base64");

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "MP3",
      sampleRateHertz: 16000,
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  // Store transcription with timestamps
  const transcriptWithTimestamps = response.results.map((result) => ({
    transcript: result.alternatives[0].transcript,
    timestamp: result.resultEndTime.seconds,
  }));

  return transcriptWithTimestamps;
}
