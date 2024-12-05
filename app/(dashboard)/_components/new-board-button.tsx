"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewBoardButton = ({ orgId, disabled }: NewBoardButtonProps) => {
  const { mutate: createBoard, pending } = useApiMutation(api.board.create);
  const router = useRouter();

  const onClick = () => {
    createBoard({ orgId, title: "Untitled" })
      .then((id: string) => {
        toast.success("Board created");
        router.push(`/board/${id}`);
      })
      .catch(() => toast.error("Failed to create board"));
  };

  return (
    <button
      onClick={onClick}
      disabled={pending || disabled}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-400 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) && "cursor-not-allowed opacity-75 hover:bg-blue-400"
      )}
    >
      <div />
      <Plus className="w-12 h-12 text-white stroke-1" />
      <p className="text-sm text-white font-light">New board</p>
    </button>
  );
};
