import React from "react";

import { Play } from "lucide-react";

import VideoJS, {
  Player,
  VideoJSOptions,
} from "@/components/VideoJS";

const images = [
  {
    title: "A cup of tea and a book on a table",
    src: "/images/kelly-sikkema-Nz1nhubrmsY-unsplash.jpg",
    authorLink: "https://unsplash.com/@kellysikkema?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    photoLink:
      "https://unsplash.com/photos/a-cup-of-tea-and-a-book-on-a-table-Nz1nhubrmsY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
  },
  {
    title: "A close up of a planet with a black background",
    src: "/images/sheng-hu-0H18vkgrs2Q-unsplash.jpg",
    authorLink: "https://unsplash.com/@laohu911?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    photoLink:
      "https://unsplash.com/photos/a-close-up-of-a-planet-with-a-black-background-0H18vkgrs2Q?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
  },
  {
    title: "A shark swimming in a body of water",
    src: "/images/willian-justen-de-vasconcellos-m9cupOWnpro-unsplash.jpg",
    authorLink:
      "https://unsplash.com/@willianjusten?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    photoLink:
      "https://unsplash.com/photos/a-shark-swimming-in-a-body-of-water-m9cupOWnpro?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
  },
  {
    title: "A view of a city at night from the top of a hill",
    src: "/images/sheng-hu-5Y9a43hhYwY-unsplash.jpg",
    authorLink: "https://unsplash.com/@laohu911?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    photoLink:
      "https://unsplash.com/photos/a-view-of-a-city-at-night-from-the-top-of-a-hill-5Y9a43hhYwY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
  },
];

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
    <>
      <div className="grid grid-cols-12">
        <div></div>
        <div className="col-span-10">
          <div className="pt-10 rounded-sm">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>
          <div className="mt-2 mb-3">
            <h1 className="text-2xl">Peaceful Boat Ride on a Lake</h1>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {images.map((image, index) => (
              <div className="relative group hover:cursor-pointer rounded-sm">
                <img src={image.src} alt={image.title} key={index} className="group-hover:brightness-50" />
                <Play className="invisible group-hover:visible absolute top-[45%] left-[48%] h-[10%] w-[10%] stroke-slate-300" />
              </div>
            ))}
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}
