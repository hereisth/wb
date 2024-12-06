"use client";

import Link from "next/link";
import { Poppins } from "next/font/google";
import { useQuery } from "convex/react";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hint } from "@/components/hint";
import { Actions } from "@/components/actions";
import { cn } from "@/lib/utils";
import { useRenameModel } from "@/store/use-rename-modal";

interface InfoProps {
  boardId: string;
}


const font = Poppins({
  subsets: ["latin"],
  weight: "600",
});


const TabSeperator = () => {
  return (
    <div className="text-neutral-300 px-1.5">
      |
    </div>
  );
};


export const Info = ({ boardId }: InfoProps) => {

  const data = useQuery(api.board.get, { id: boardId as Id<"boards"> });
  const { isOpen, onOpen } = useRenameModel();

  if (!data) {
    return <Info.Skeleton />;
  }


  return (
    <div className="absolute top-2 left-2  rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to home" side="bottom" sideOffset={10}>
        <Button asChild className="px-2" variant="border">
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={20} height={20} />
            <span className={cn("font-semibold text-base text-black", font.className)}>
              BoardStorm
            </span>
          </Link>
        </Button>
      </Hint>

      <TabSeperator />
      <Hint label="Rename board" side="bottom" sideOffset={10}>
        <Button
          variant="border"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data?._id, data?.title)}
        >
          {data?.title}
        </Button>
      </Hint>

      <TabSeperator />
      <Actions
        id={data._id}
        title={data.title}
        side="bottom"
        sideOffset={10}
      >
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="border">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>

    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px] bg-white">
      <Skeleton className="h-full w-full bg-muted-400" />
    </div>
  );
};
