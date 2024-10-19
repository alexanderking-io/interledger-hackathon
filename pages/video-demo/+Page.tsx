import React from "react";

// import type { Data } from "./+data";
import VideoJS, {
  Player,
  VideoJSOptions,
} from "@/components/VideoJS";

export default function Page() {
  const playerRef = React.useRef<Player | null>(null);

  const videoJsOptions: VideoJSOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "/videos/some_video.mp4",
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

  return (
    <div className="w-full">
      <h1>Hi Video Demo!</h1>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}
