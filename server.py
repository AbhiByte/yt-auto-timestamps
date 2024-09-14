from flask import Flask, jsonify, request
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/get_transcript', methods=['GET'])
def get_transcript():
    video_id = request.args.get('video_id')
    print(f"Received request for video ID: {video_id}")  # Add this line for debugging
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        print(f"Successfully fetched transcript for video ID: {video_id}")  # Add this line for debugging
        return jsonify(transcript)
    except Exception as e:
        print(f"Error fetching transcript for video ID {video_id}: {str(e)}")  # Add this line for debugging
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)