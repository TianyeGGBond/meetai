'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';


import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';
import { MeetingStatus } from '../../types';
import { GenerateAvatar } from '@/components/ui/generated-avatar';
import { MeetingIdViewHeader } from '../components/meeting-id-view-header';
import { UpdateMeetingDialog } from '../components/update-meeting-dialog';

import { UpcomingState } from '../components/upcoming-state';
import { ActiveState } from '../components/active-state';
import { ProcessingState } from '../components/processing-state';
import { CancelledState } from '../components/cancelled-state';


type Props = {
    meetingId: string;
};


export function MeetingIdView({ meetingId }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const [updateMeetingUpdate, setUpdateMeetingUpdate] = useState(false);

    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
    const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
        'Are you sure?',
        'The following action will remove this meeting',
    );

    const isUpcoming = data.status === "upcoming";
    const isActive = data.status === "active";
    const isCancelled = data.status === "cancelled";
    const isProcessing = data.status === "processing";
    const isCompleted = data.status === "completed";


    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            async onSuccess() {
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
                router.push('/meetings');
            },
            onError(error) {
                toast.error(error.message);
            },
        }),
    );


    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();

        if (!ok) return;

        await removeMeeting.mutateAsync({ id: meetingId });
    };


    return (
        <>
            <RemoveConfirmationDialog />
            <UpdateMeetingDialog
                open={updateMeetingUpdate}
                onOpenChange={setUpdateMeetingUpdate}
                initialValues={data}
            />
            <div className="flex flex-1 flex-col gap-y-4 overflow-hidden p-4 md:px-8">
                <MeetingIdViewHeader
                    meetingId={meetingId}
                    meetingName={data.name}
                    onEdit={() => setUpdateMeetingUpdate(true)}
                    onRemove={handleRemoveMeeting}
                />

                {isActive && <ActiveState meetingId={data.id} />}
                {isProcessing && <ProcessingState />}
                {isCompleted && <ProcessingState />}
                {isCancelled && <CancelledState />}
                {isUpcoming && (
                    <UpcomingState
                        meetingId={data.id}
                        isCancelling={false}
                        onCancelMeeting={() => { }} />
                )}

                <div className="rounded-lg border bg-white">
                    <div className="col-span-5 flex flex-col gap-y-5 p-4">
                        <div className="flex items-center gap-x-3">
                            <GenerateAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
                            <h2 className="text-2xl font-medium">{data.name}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}