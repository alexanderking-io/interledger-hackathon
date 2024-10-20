import React, {
  useEffect,
  useRef,
} from "react";

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
import { usePageContext } from "vike-react/usePageContext";

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
  {
    title: "A foggy road with trees on both sides",
    src: "/images/jisca-lucia-PM9OTjUk-iY-unsplash.jpg",
    authorLink:
      "https://unsplash.com/@wanderlandjournal?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
    photoLink:
      "https://unsplash.com/photos/a-foggy-road-with-trees-on-both-sides-PM9OTjUk-iY?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
  },
];

function startPayment(walletAddress: string, callback: () => void) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/api/initiate-payment?serviceType=video,userWallet=${walletAddress}`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      let redirectUrl = data.res;
      window.open(redirectUrl, "_blank");
      callback();
    }
  };

  xhr.send();
}

function sendPayment() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/recurring-payment?serviceType=video");
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);

        if (data.success === true) {
          resolve("success");
        } else {
          resolve("failed");
        }
      } else {
        reject(`Request failed with status ${xhr.status}`);
        resolve("failed");
      }
    };
    xhr.onerror = function () {
      reject("Request failed due to a network error.");
      resolve("failed");
    };
    xhr.send();
  });
}

export default function Page() {
  const playerRef = useRef<Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  let previousTime = 0;
  let paymentFailedCounter = 0;

  const videoJsOptions: VideoJSOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [],
  };

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player;
    let previousTime = 0;
    let currentTime = 0;
    let seekStart: number | null = null;

    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("timeupdate", () => {
      previousTime = currentTime;
      currentTime = player.currentTime()!;
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });

    player.on("seeking", () => {
      if (seekStart === null) {
        seekStart = previousTime;
      }
    });

    player.on("seeked", () => {
      if (currentTime > seekStart!) {
        player.currentTime(seekStart!);
      }
      seekStart = null;
    });

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        const currentTime = playerRef.current?.currentTime();

        if (currentTime && currentTime !== previousTime) {
          sendPayment().then((paymentResponse) => {
            if (paymentResponse === "success") {
              paymentFailedCounter = 0;
            }

            if (paymentResponse === "failed") {
              paymentFailedCounter++;
              if (paymentFailedCounter === 3) {
                playerRef.current?.pause();
                if (playerRef.current) {
                  playerRef.current.currentTime(currentTime - 6);
                }
                paymentFailedCounter = 0;
                alert("Payment failed, please try again.");
              }
            }
          });

          previousTime = currentTime;
        }
      }, 2000);
    }
  };

  useEffect(() => {
    const { user } = usePageContext();
    // Run startPayment when the component mounts
    startPayment(user.walletAddress, () => {
      videoJsOptions.sources = [
        {
          src: "/videos/some_video.mp4",
          type: "video/mp4",
        },
      ];

      playerRef.current?.src(videoJsOptions.sources);
    });

    // Clean up interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
        <div className="bg-stone-800 py-8 flex col-span-3 overflow-y-auto max-h-screen rounded-md">
          <div className="flex flex-col gap-4 mb-8 h-full rounded-md px-8">
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
