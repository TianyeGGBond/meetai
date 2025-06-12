import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { MeetingIdView } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers";
import React, { Suspense } from "react";


type Props = {
    params: Promise<{ meetingId: string }>;
};


export default async function Page({ params }: Props) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/sign-in');
    }

    const { meetingId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
                fallback={
                    <LoadingState title="Loading Meeting" description="This may take a few seconds" />
                }
            >
                <ErrorBoundary
                    fallback={
                        <ErrorState title="Error Loading Meeting" description="Please try again later" />
                    }
                >
                    <MeetingIdView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
};

