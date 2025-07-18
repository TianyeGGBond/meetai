import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { auth } from '@/lib/auth';

import { getQueryClient, trpc } from '@/trpc/server';
import { CallMeetingView } from '@/modules/call/ui/views/call-view';

type Props = {
    params: Promise<{
        meetingId: string;
    }>;
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
    void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
                fallback={
                    <LoadingState title="Loading Meeting" description="This may take a few seconds" />
                }
            >
                <ErrorBoundary
                    fallback={<ErrorState title="Failed to loading" description="Please try again later" />}
                >
                    <CallMeetingView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}