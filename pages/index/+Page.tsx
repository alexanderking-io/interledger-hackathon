import { useScreen } from "usehooks-ts";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

import FlickeringGrid from "@/components/ui/flickering-grid";
import { RainbowButton } from "@/components/ui/rainbow-button";
import RetroGrid from "@/components/ui/retro-grid";
import WordPullUp from "@/components/ui/word-pull-up";

export default function Page() {
  const screen = useScreen();
  const { user } = usePageContext();

  return (
    <>
      <section className="flex items-center justify-center w-full min-h-screen">
        <FlickeringGrid
          className="z-0 absolute inset-0]"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={screen?.height ? screen.height : 800}
          width={screen?.width ? screen.width - 128 : 800}
        />
        <div className="flex flex-col justify-center">
          <WordPullUp
            className="text-9xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem] z-10 mb-10"
            words="Table AJ - Team 41"
          />
          <RainbowButton
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            {user ? "Dashboard" : "Sign In"}
          </RainbowButton>
        </div>
      </section>

      <footer className="flex flex-col justify-center items-center pt-16">
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background">
          <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
            <div className="text-5xl mb-4">Our Team:</div>
            <div className="text-4xl">Alex</div>
            <div className="text-4xl">Amahle</div>
            <div className="text-4xl">Brandon</div>
            <div className="text-4xl">Uzayr</div>
          </span>
          <RetroGrid />
        </div>
      </footer>
    </>
  );
}
