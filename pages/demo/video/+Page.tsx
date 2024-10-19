import React from "react";

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

  return (
    <>
      <div className="grid grid-cols-12">
        <div></div>
        <div className="col-span-10">
          <div className="pt-10">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
          <div className="pt-4">
            <h1 className="text-2xl">Video Demo!</h1>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}
