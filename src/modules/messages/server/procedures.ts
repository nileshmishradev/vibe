import z from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { prisma } from "@/lib/db";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

export const messagesRouter = createTRPCRouter({


    create: protectedProcedure
        .input(
            z.object({
                value: z.string()
                    .min(1, { message: "Message is required" })
                    .max(10000,{message: "Value is too long"}),
                projectId: z.string()
                    .min(1,{message: "Project id is required"}),
                
            }),
        )
        .mutation(async ({ input ,ctx }) => {

            const existingProjects = await prisma.project.findUnique({
                where:{
                    id: input.projectId,
                    userId: ctx.auth.userId
                }
            })

            if(!existingProjects){
                throw new TRPCError
                ({
                    code: "NOT_FOUND",
                    message: "Project not found"
                })
            }

            try{
                await consumeCredits();
            }catch(e){
                if(e instanceof Error){
                    // something else failed
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Something went wrong"
                    })   
                } else {
                    throw new TRPCError({
                        code: "TOO_MANY_REQUESTS",
                        message: "Credits exusted"
                    })
                }
            }

            const createdMessage = await prisma.message.create({
                data: {
                    projectId:existingProjects.id,
                    content: input.value,
                    role: "USER",
                    type: "RESULT"
                },
            });

            await inngest.send({
                name: "code-agent/run",
                data: {
                    value: input.value,
                    projectId:input.projectId
                }
            });

            return  createdMessage;

        }),

        getMany: protectedProcedure
         .input(
            z.object({
                projectId: z.string()
                    .min(1,{message: "Project id is required"}),
            }),
        )
        .query(async ({input ,ctx}) =>{
            const messages = await prisma.message.findMany({
                where : {
                    projectId : input.projectId,
                    project:{
                        userId:ctx.auth.userId,
                    }
                },
                include : {
                    fragment:true
                },
                orderBy:{
                    updatedAt:"asc"
                }
                
                
            })
            return messages
        })
})