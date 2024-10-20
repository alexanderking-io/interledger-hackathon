import FlickeringGrid from "@/components/ui/flickering-grid";
import { useScreen } from "usehooks-ts";

export default function Page() {
  const screen = useScreen()

  return (
    <>
      <h1>Landing</h1>
      <h1>Team 41</h1>

      <section>
        <FlickeringGrid
          className="z-0 absolute inset-0]"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={screen.height ?? 800}
          width={screen.width ?? 800}
        />
      </section>
      <section></section>
      <section></section>

      <footer></footer>
    </>
  );
}
