"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";


const page = () => {
  const [value , setValue]=useState("");

  const trpc = useTRPC()
  const callingfun= useMutation(trpc.invork.mutationOptions({
    onSuccess: () => {
      toast.success("Background job started");
    },
  }))
  return (  
    <div>
      <Input value={value} onChange={(e)=>{setValue(e.target.value)}}/>
      <Button disabled={callingfun.isPending} onClick={ ()=>{callingfun.mutate({value:value})}}> 
        calling inggest function 
      </Button>
    </div>
  );
}
 
export default page;