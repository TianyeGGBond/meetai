
import ResponsiveDialog from '@/components/responsive-dialog';
import { MeetingGetOne } from '../../types';
import { MeetingForm } from './meeting-form';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
};

export function UpdateMeetingDialog({ open, initialValues, onOpenChange }: Props) {
    return (
        <ResponsiveDialog
            title="Edit Meeting"
            description="Edit the meeting detail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDialog>
    );
}