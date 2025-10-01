import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("step 1", "30s");
    await step.sleep("step 2", "10s");
    await step.sleep("step 3", "10s");
    return { message: `Hello ${event.data.email}!` };
  },
);