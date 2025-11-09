"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { json } from "zod";


const page = () => {
  const [value , setValue]=useState("");

  const trpc = useTRPC()
  const {data : messages} = useQuery(trpc.messages.getMany.queryOptions())

  const callingfun= useMutation(trpc.messages.create.mutationOptions({
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
      {JSON.stringify(messages,null,2)}
    </div>
  );
}
 
export default page;