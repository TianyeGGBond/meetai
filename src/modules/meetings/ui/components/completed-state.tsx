import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { GenerateAvatar } from "@/components/ui/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

//npm install react-markdown --legacy-peer-deps
import ReactMarkdown from "react-markdown";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white rounded-lg border px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-background justify-start rounded-none h-13 gap-10">
                            <TabsTrigger
                                value="summary"
                                className="
                                    flex flex-row items-center gap-2
                                    text-muted-foreground
                                    rounded-none
                                    bg-background
                                    data-[state=active]:shadow-none
                                    border-b-2
                                    border-transparent
                                    data-[state=active]:border-b-primary
                                    data-[state=active]:text-accent-foreground
                                    h-full
                                    hover:text-accent-foreground
                                    ">
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>

                            <TabsTrigger
                                value="transcript"
                                className="
                                    flex flex-row items-center gap-2
                                    text-muted-foreground
                                    rounded-none
                                    bg-background
                                    data-[state=active]:shadow-none
                                    border-b-2
                                    border-transparent
                                    data-[state=active]:border-b-primary
                                    data-[state=active]:text-accent-foreground
                                    h-full
                                    hover:text-accent-foreground
                                    ">
                                <FileTextIcon />
                                Transcript
                            </TabsTrigger>

                            <TabsTrigger
                                value="recording"
                                className="
                                    flex flex-row items-center gap-2
                                    text-muted-foreground
                                    rounded-none
                                    bg-background
                                    data-[state=active]:shadow-none
                                    border-b-2
                                    border-transparent
                                    data-[state=active]:border-b-primary
                                    data-[state=active]:text-accent-foreground
                                    h-full
                                    hover:text-accent-foreground
                                    ">
                                <FileVideoIcon />
                                Recording
                            </TabsTrigger>

                            <TabsTrigger
                                value="chat"
                                className="
                                    flex flex-row items-center gap-2
                                    text-muted-foreground
                                    rounded-none
                                    bg-background
                                    data-[state=active]:shadow-none
                                    border-b-2
                                    border-transparent
                                    data-[state=active]:border-b-primary
                                    data-[state=active]:text-accent-foreground
                                    h-full
                                    hover:text-accent-foreground
                                    ">
                                <SparklesIcon />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
                <TabsContent value="recording">
                    <div className="bg-white round-lg border">
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg"
                            controls
                        />
                    </div>
                </TabsContent>

                <TabsContent value="summary">
                    <div className="bg-white rounded-lg border">
                        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize">
                                {data.name}
                            </h2>
                            <div className="flex gap-x-2 items-center">
                                <Link
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                                >
                                    <GenerateAvatar
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>{" "}
                                <p>{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4" />
                                <p>General summary</p>
                            </div>

                            <Badge
                                variant="outline"
                                className="flex items-center gap-x-2 [&>svg]:size-4"
                            >
                                <ClockFadingIcon className="text-blue-700" />
                                {data.duration ? formatDuration(data.duration) : "No duration"}
                            </Badge>
                            <div>
                                <ReactMarkdown
                                    components={{
                                        h1: (props) => <h1 className="text-2xl font-medium mb-6" {...props} />,
                                        h2: (props) => <h2 className="text-xl font-medium mb-6" {...props} />,
                                        h3: (props) => <h3 className="text-lg font-medium mb-6" {...props} />,
                                        h4: (props) => <h4 className="text-base font-medium mb-6" {...props} />,
                                        p: (props) => <h4 className="leading-relaxed mb-6" {...props} />,
                                    }}
                                >
                                    {data.summary}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}