"use client";

import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { use } from "react";
import { BoardList } from "./_components/board-list";

type SearchParams = {
  search?: string;
  favorite?: string;
};

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

export default function DashboardPage(props: DashboardPageProps) {
  const searchParams = use(props.searchParams);
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)]">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
