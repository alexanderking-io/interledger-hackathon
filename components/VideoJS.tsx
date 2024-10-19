import "video.js/dist/video-js.css";

import React from "react";

import videojs from "video.js";

export type Player = ReturnType<typeof videojs>;
type PlayerReadyCallback = (player: Player) => void;

export interface VideoJSOptions {
  autoplay?: boolean | "muted" | "play" | "any";
  controls?: boolean;
  height?: string | number;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  preload?: "auto" | "metadata" | "none";
  src?: string;
  width?: string | number;
  responsive?: boolean;
  sources?: { src: string; type: string }[];
  fluid?: boolean;
}

interface VideoJSProps {
  // See options: https://videojs.com/guides/options
  options: VideoJSOptions;
  onReady: PlayerReadyCallback;
}

export const VideoJS = ({ options, onReady }: VideoJSProps) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Player | null>(null);

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current!.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        if (onReady) {
          onReady(player);
        }
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
