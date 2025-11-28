

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react"
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { Fragment } from "@/generated/prisma";
import { MessageLoading } from "./message-loading";

interface Props {
  projectId: string;
  activeFragment: Fragment | null,
  setActiveFragment: (fragment: Fragment | null) => void
};

export const MessagesContainer = ({ projectId ,activeFragment,setActiveFragment}: Props) => {

  // useref is used
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageIdRef = useRef<string| null>(null);

  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
    projectId: projectId,
  }, {
        // TODO: Temperary live Message
        refetchInterval: 5000,
    }))

    // selecting fragment
  useEffect(() => {
     const lastAssistantMessage = messages.findLast((message) => message.role === "ASSISTANT");

        if(lastAssistantMessage?.fragment && lastAssistantMessage.id !== lastAssistantMessageIdRef.current){
            setActiveFragment(lastAssistantMessage.fragment)
            lastAssistantMessageIdRef.current = lastAssistantMessage.id
        }
    
  }, [messages,setActiveFragment]); // note useeffect will work when change

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  // note
  const lastMessage = messages[messages.length - 1];
  const isLastMessageUser = lastMessage?.role === "USER";

  return (
   <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={activeFragment?.id === message.fragment?.id}
              onFragmentClick={() =>setActiveFragment(message.fragment)}
              type={message.type}
            />
          ))}
          {/* note understand */}
          {/* When isLastMessageUser is true, React renders <MessageLoading /> When false, it renders nothing*/}
           {isLastMessageUser && <MessageLoading />} 
          {/* understand bottomRef */}
          <div ref={bottomRef}></div> 
        </div>
      </div>
        <div className="relative p-3 pt-1">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none"/>
            <MessageForm projectId = {projectId}/>
        </div>
    </div>
  );
};