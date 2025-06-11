import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import MeetingsView, {
    MeetingsViewError,
    MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meeting-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MeetingsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        redirect("/sign-in")
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );


    return (
        <>
            <MeetingsListHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<MeetingsViewLoading />}>
                    <ErrorBoundary fallback={<MeetingsViewError />}>
                        <MeetingsView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
};

export default MeetingsPage;