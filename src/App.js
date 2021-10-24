import { useState } from "react";
import "./styles.css";

export default function App() {
  const [videoSource, setVideoSource] = useState("");
  const [isVideoAvailable, setVideoAvailability] = useState(false);

  const beginRecording = async () => {
    try {
      setVideoAvailability(false);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";
      let mediaRecorder = new MediaRecorder(stream, {
        mimeType
      });

      let chunks = [];
      mediaRecorder.addEventListener("dataavailable", function (e) {
        chunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", function () {
        let blob = new Blob(chunks, {
          type: chunks[0].type
        });

        setVideoSource(URL.createObjectURL(blob));
        setVideoAvailability(true);
      });

      //we have to start the recorder manually
      mediaRecorder.start();
    } catch (error) {
      console.log("Can't Record Screen");
    }
  };

  const downloadVideo = () => {
    let a = document.createElement("a");
    a.href = videoSource;
    a.download = "video.webm";
    a.click();
  };

  return (
    <div className="App">
      <h4>Let's Record The Screen</h4>
      {isVideoAvailable && <video src={videoSource} width={600} controls />}
      <br />
      <button onClick={beginRecording}>
        {isVideoAvailable ? "Record Another" : "Record"}
      </button>
      {isVideoAvailable && <button onClick={downloadVideo}>Download</button>}
    </div>
  );
}
