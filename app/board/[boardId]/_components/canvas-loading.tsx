import { Info } from "./info";
import { Participants } from "./participants";
import { Loader } from "lucide-react";
import { Toolbar } from "./toolbar";

const CanvasLoading = () => {
  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
      <Loader className="h-10 w-10 text-muted-foreground animate-spin" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};

export default CanvasLoading;