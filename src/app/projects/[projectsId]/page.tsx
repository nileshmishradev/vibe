interface Props {
  params: Promise<{
    projectsId: string; //[filename] look structure
  }>;
}

const Page = async ({ params }: Props) => {
  const {projectsId} = await params;

  return (
    <div>
      Project id: {projectsId}
    </div>
  );
};

export default Page;