"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


const page = () => {
  const trpc = useTRPC()
  const callingfun= useMutation(trpc.invork.mutationOptions({
    onSuccess: () => {
      toast.success("Done");
    },
  }))
  return (  
    <div>
      <Button disabled={callingfun.isPending} onClick={ ()=>{callingfun.mutate({text:"nilesh"})}}> 
        calling inggest function 
      </Button>
    </div>
  );
}
 
export default page;