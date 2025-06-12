"use client";

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilter } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export function MeetingsView() {
    const router = useRouter();
    const [filters, setFilters] = useMeetingsFilter();
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions(filters));

    return (
        <div className="flex flex-1 flex-col gap-y-4 overflow-auto px-4 pb-4 md:px-8">

            <DataTable
                data={data.items}
                columns={columns}
                onClickRow={(row) => router.push(`/meetings/${row.id}`)}
            />
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState
                    title="Create your first meeting"
                    description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants real time."
                />
            )}
        </div>
    );
};

export default MeetingsView;

export const MeetingsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds"
        />
    );
};

export const MeetingsViewError = () => {
    return (
        <ErrorState
            title="Failed to load meetings"
            description="Please try again later"
        />
    );
};

