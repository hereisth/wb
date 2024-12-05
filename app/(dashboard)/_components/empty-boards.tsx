import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const EmptyBoards = () => {
  const { mutate: create, pending } = useApiMutation(api.board.create);
  const { organization } = useOrganization();
  const router = useRouter();

  const onClick = () => {
    if (!organization) {
      return;
    }
    create({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created successfully");
        router.push(`/board/${id}`);
        
      })
      .catch(() => {
        toast.error("Failed to create board");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" alt="empty" height={110} width={110} />
      <h2 className="font-muted-foreground text-2xl mt-6">
        Create your first board
      </h2>
      <h2 className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </h2>
      <div className="mt-6">
        <Button disabled={pending} size="lg" onClick={onClick}>
          Create board
        </Button>
      </div>
    </div>
  );
};
