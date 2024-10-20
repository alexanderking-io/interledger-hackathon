import React from "react";

import {
  Eye,
  Play,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
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
      <div className="grid grid-cols-12 gap-4 pl-8 pt-8 p-4 bg-stone-700 min-h-screen">
        <div className="col-span-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-full bg-stone-800 p-4 rounded-lg h-14 border-stone-800 outline-stone-900"
            />
            <Search size={24} className="absolute right-6 top-4 stroke-slate-200" />
          </div>
        </div>
        <div className="col-span-9">
          <div className="bg-stone-800 rounded-lg p-8 shadow-2xl">
            <div className="rounded-lg">
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            </div>
            <div className="mb-8">
              <div className="flex justify-between">
                <h1 className="text-2xl my-4 text-slate-50">Peaceful Boat Ride on a Lake</h1>
                <div className="flex items-center">
                  <Eye className="stroke-slate-300" size={16} />
                  <span className="text-orange-400 text-md ml-2">10.2k views</span>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Just got back from an amazing boat ride on a stunning lake, and I had to capture it all for you! The
                weather was perfect, with clear skies and a gentle breeze. The views were unreal—mountains and trees
                reflecting off the calm water made it feel like we were floating through a painting. I even spotted some
                wildlife along the way! It was such a peaceful and relaxing day, and I can&apos;t wait to share the
                footage with you all. Don&apos;t forget to check out the full video for a closer look! 🌊🚤{" "}
                <span className="text-orange-400 hover:underline cursor-pointer">#BoatRide</span>{" "}
                <span className="text-orange-400 hover:underline cursor-pointer">#NatureViews</span>{" "}
                <span className="text-orange-400 hover:underline cursor-pointer">#LakeVibes</span>{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-stone-800 py-8 flex col-span-3 overflow-y-hidden hover:overflow-y-auto rounded-md">
          <div className="flex flex-col gap-4 mb-8 h-screen rounded-md px-8">
            {images.map((image, index) => (
              <div className="relative group hover:cursor-pointer rounded-md " key={index}>
                <img src={image.src} alt={image.title} className="group-hover:brightness-50 rounded-md shadow-2xl" />
                <Play
                  className="invisible group-hover:visible absolute top-[45%] left-[45%] h-[10%] w-[10%] stroke-slate-300"
                  size={64}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
