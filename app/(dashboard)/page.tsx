"use client";

import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { Usable, use } from "react";
import { BoardList } from "./_components/board-list";

type SearchParams = {
  search?: string;
  favorite?: string;
};

interface DashboardPageProps {
  searchParams: SearchParams;
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { organization } = useOrganization();
  //TODO: `use` according to nextjs doc, BUT WHY???
  const searchParamsUsed = use(searchParams as Usable<SearchParams>);

  return (
    <div className="flex-1 h-[calc(100%-80px)]">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParamsUsed} />
      )}
    </div>
  );
}
