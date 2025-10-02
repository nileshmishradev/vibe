import { Agent, gemini, createAgent } from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter"
import {getSandbox} from "./utils"
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event ,step }) => {

    //
    const sandboxId = await step.run("get-sandbox-id" , async () =>{
      const sandbox = await Sandbox.create("vibe-nextjs-learning");
      return sandbox.sandboxId;
    })
    
    // Create a new agent with a system prompt (you can add optional tools, too)
    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer. You write maintable and read able code. write simple next.js & react snippets",
      model: gemini({ model: 'gemini-2.5-flash'}),
    });

    const { output } = await codeAgent.run(
    `write the folloing snippet : ${event.data.value}`,
    )

    const sandboxUrl = await step.run("get-sandbox-url" , async () =>{
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`;
    })

    return { output , sandboxUrl}; // email tha
 },
);