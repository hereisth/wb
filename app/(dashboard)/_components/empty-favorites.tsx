import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-favorites.svg" alt="empty" height={140} width={140} />
      <h2 className="font-muted-foreground text-2xl mt-6">No favorites yet!</h2>
      <h2 className="text-muted-foreground text-sm mt-2">
        Favorite boards to save them here
      </h2>
    </div>
  );
};
