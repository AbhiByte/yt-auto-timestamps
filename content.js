// content.js

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

// Step 5: Combine everything and execute when the page is loaded
async function main() {
  const videoUrl = document.querySelector("video").src;

  // Call to transcript.js function to transcribe the video (you will need to make sure this function works correctly)
  const transcriptWithTimestamps = await transcribeVideo(videoUrl);

  const comments = extractComments(); // Extract all comments from the page

  comments.forEach((comment) => {
    const timestamp = findMatchingTimestamp(comment, transcriptWithTimestamps);
    if (timestamp !== null) {
      injectTimestamp(comment.element, timestamp);
    }
  });
}

// Run the main function when the content script is loaded
main();
