// background.js

console.log("%c Background script loaded ", "background: #222; color: #bada55");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchTranscript") {
    fetch(`http://localhost:5000/get_transcript?video_id=${request.videoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((transcript) => {
        console.log("Transcript fetched successfully:", transcript);
        sendResponse({ transcript });
      })
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      });
    return true; // Indicates that the response is asynchronous
  }
});
