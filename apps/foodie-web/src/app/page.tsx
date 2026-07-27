import {
  Typography,
  StatTile,
  DiscoveryListItem,
  Button,
} from "@foodie/ui";
import { ScreenShell } from "@/components/ScreenShell";

/**
 * Home screen, matching the Figma Screens page (node 6:9) — built entirely
 * from `@foodie/ui` components plus the app-local `ScreenShell` frame
 * (Phase 4). No interactivity wired yet (the "+ Try Something New" button
 * has no `onClick`) — that lands in Phase 6 alongside the flow steps.
 */
export default function HomePage() {
  return (
    <ScreenShell variant="home">
      <div className="flex w-full flex-col items-center gap-[6px]">
        <Typography variant="heading-xl">👋 Hi, Emma!</Typography>
        <Typography variant="body-regular" color="secondary">
          Welcome to your food adventure
        </Typography>
      </div>

      <div className="flex w-full gap-[10px]">
        <StatTile className="flex-1" color="teal" value="47" label="Foods Tried" />
        <StatTile className="flex-1" color="orange" value="8" label="This Month" />
        <StatTile className="flex-1" color="pink" value="🍕" label="Fave Food" />
      </div>

      <div className="flex w-full flex-col items-start gap-md">
        <Typography variant="heading-m">🌟 Recent Discoveries</Typography>
        <DiscoveryListItem name="Sushi" rating={5} date="21 Jul" />
        <DiscoveryListItem name="Ramen" rating={5} date="20 Jul" />
      </div>

      <Button color="teal" className="w-full">
        + Try Something New
      </Button>

      <Typography variant="label-caption" color="secondary" className="w-full text-center">
        Tap to add a new food adventure
      </Typography>
    </ScreenShell>
  );
}
