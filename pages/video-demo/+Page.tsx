import React from "react";

// import type { Data } from "./+data";
import VideoJS, {
  Player,
  VideoJSOptions,
} from "@/components/VideoJS";

function sendPayment() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:8080/api/recurring-payment');
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      console.log(data);
    }
  };
  xhr.send();
}

export default function Page() {
  const playerRef = React.useRef<Player | null>(null);
  var previousTime = 0;

  const videoJsOptions: VideoJSOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "/assets/videos/some_video.mp4",
        type: "video/mp4",
      },
    ],
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("timeupdate", () => {
      console.log("Current Time", player.currentTime());
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  setInterval(() => {
    var currentTime = playerRef.current?.currentTime();

    if (currentTime && currentTime !== previousTime) {
      sendPayment();
      previousTime = currentTime;
    }
  }, 2000);

  return (
    <div className="w-full">
      <h1>Hi Video Demo!</h1>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}
