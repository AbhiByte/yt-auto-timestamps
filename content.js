// content.js
async function fetchYouTubeTranscript() {
  const videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId) {
    console.error("No video ID found");
    return null;
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "fetchTranscript", videoId },
      (response) => {
        if (response.error) {
          console.error("Error fetching transcript:", response.error);
          resolve(null);
        } else {
          resolve(response.transcript);
        }
      }
    );
  });
}

function extractComments() {
  const commentElements = document.querySelectorAll(
    "ytd-comment-thread-renderer"
  );
  return Array.from(commentElements).map((element) => ({
    text: element.querySelector("#content-text").textContent,
    element: element,
  }));
}
// Step 3: Analyze comments and match with the video transcript
function findMatchingTimestamp(comment, transcriptWithTimestamps) {
  // Try to find the comment text (or a portion of it) in the video transcript
  const foundEntry = transcriptWithTimestamps.find((entry) =>
    comment.text.toLowerCase().includes(entry.transcript.toLowerCase())
  );

  if (foundEntry) {
    return foundEntry.timestamp; // Return the timestamp for the matching transcript
  }

  return null;
}

// Step 4: Inject the timestamp into the comment
function injectTimestamp(commentElement, timestamp) {
  const timestampLink = document.createElement("a");
  const minutes = Math.floor(timestamp / 60);
  const seconds = timestamp % 60;

  timestampLink.href = `#`; // You could improve this by making it link directly to the video timestamp
  timestampLink.innerText = `Jump to ${minutes}:${seconds}`;
  timestampLink.style.color = "blue";
  timestampLink.style.cursor = "pointer";

  timestampLink.addEventListener("click", (e) => {
    e.preventDefault();
    const video = document.querySelector("video");
    if (video) {
      video.currentTime = timestamp;
      video.play();
    }
  });

  commentElement.appendChild(document.createElement("br"));
  commentElement.appendChild(timestampLink);
}

async function main() {
  const transcript = await fetchYouTubeTranscript();
  if (!transcript) {
    console.log("No transcript available for this video");
    return;
  }

  const comments = extractComments();

  comments.forEach((comment) => {
    const timestamp = findMatchingTimestamp(comment, transcript);
    if (timestamp !== null) {
      injectTimestamp(comment.element, timestamp);
    }
  });
}

// Run the main function when the content script is loaded
main();
