import { Agent, gemini, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    
    // Create a new agent with a system prompt (you can add optional tools, too)
    const summarizer = createAgent({
      name: "code-agent",
      system: "You are an expert next.js developer. You write maintable and read able code. write simple next.js & react snippets",
      model: gemini({ model: 'gemini-2.5-flash'}),
    });

    const { output } = await summarizer.run(
    `write the folloing snippet : ${event.data.value}`,
);
console.log(output);

    return { output }; // email tha
  },
);