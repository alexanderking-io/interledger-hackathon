import React, { useEffect, useRef } from "react";
import VideoJS, { Player, VideoJSOptions } from "@/components/VideoJS";

function startPayment(callback: () => void) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "http://localhost:8080/api/initiate-payment?serviceType=video"
  );

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
    xhr.open("GET", "http://localhost:8080/api/recurring-payment?serviceType=video");
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
      }
    };
    xhr.onerror = function () {
      reject("Request failed due to a network error.");
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

    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("timeupdate", () => {
      console.log("Current Time", player.currentTime());
    });

    player.on("dispose", () => {
      console.log("player will dispose");
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
    // Run startPayment when the component mounts
    startPayment(() => {
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
    <div className="w-full">
      <h1>Hi Video Demo!</h1>
      
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </div>
  );
}
