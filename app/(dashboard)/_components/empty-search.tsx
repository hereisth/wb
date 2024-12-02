import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-search.svg" alt="empty" height={140} width={140} />
      <h2 className="font-muted-foreground text-2xl mt-6">No results found!</h2>
      <h2 className="text-muted-foreground text-sm mt-2">
        Try search something else
      </h2>
    </div>
  );
};
