import { ProjectView } from "@/modules/projects/ui/views/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    projectId: string; //[filename] look structure
  }>;
}

const Page = async ({ params }: Props) => {
  const {projectId} = await params;
  // server component so , prefetching
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId, // giving projectid to getmany function of message
    }))

    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId, // passing projectid as id to getone function of projects
    }))

  return (
    <div>
       <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div>Loading...</div>}>
                    <ProjectView projectId={projectId} />
                </Suspense>
        </HydrationBoundary>
    </div>
  );
};

export default Page;