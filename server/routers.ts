/* Style direction: Dark Cosmic Luxury — server contracts stay minimal, explicit and secure; provider credentials never enter the client bundle. */
import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const rolePrompts: Record<string, string> = {
  "The Muse": "You are The Muse: sensory, associative and image-led. Return unexpected but usable creative directions.",
  "The Mirror": "You are The Mirror: reflective, precise and psychologically curious. Reveal patterns without diagnosing.",
  "The Producer": "You are The Producer: practical, structured and sound-aware. Turn fragments into a concise production plan.",
  "The Oracle": "You are The Oracle: symbolic, mysterious and grounded. Read ambiguity as creative material, not certainty.",
  "The Scribe": "You are The Scribe: an elegant editor of lyrics, poems and narrative fragments. Protect the user's voice.",
};

async function callLocalModel(role: string, input: string) {
  const baseUrl = process.env.LOCAL_MODEL_BASE_URL;
  const model = process.env.LOCAL_MODEL_NAME || "belentani-local";
  if (!baseUrl) return { configured: false, message: "Local model endpoint not configured. Add LOCAL_MODEL_BASE_URL to activate this role." };
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.LOCAL_MODEL_TOKEN ? { Authorization: `Bearer ${process.env.LOCAL_MODEL_TOKEN}` } : {}) },
    body: JSON.stringify({ model, temperature: 0.82, messages: [{ role: "system", content: rolePrompts[role] || rolePrompts["The Muse"] }, { role: "user", content: input }] }),
  });
  if (!response.ok) throw new Error(`Local model responded with ${response.status}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return { configured: true, output: data.choices?.[0]?.message?.content || "The role returned an empty signal." };
}

async function callImageProvider(prompt: string) {
  const baseUrl = process.env.IMAGE_PROVIDER_BASE_URL;
  if (!baseUrl) return { configured: false, message: "Image provider not configured. Add IMAGE_PROVIDER_BASE_URL to activate image generation." };
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.IMAGE_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.IMAGE_PROVIDER_TOKEN}` } : {}) },
    body: JSON.stringify({ prompt, style: "dark cosmic luxury", brand: "Belentani // Judas" }),
  });
  if (!response.ok) throw new Error(`Image provider responded with ${response.status}`);
  return { configured: true, result: await response.json() };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  lab: router({
    runRole: publicProcedure.input(z.object({ role: z.string().min(1), input: z.string().min(1).max(12000) })).mutation(async ({ input }) => callLocalModel(input.role, input.input)),
    generateImage: publicProcedure.input(z.object({ prompt: z.string().min(1).max(12000) })).mutation(async ({ input }) => callImageProvider(input.prompt)),
    status: publicProcedure.query(() => ({ localModel: Boolean(process.env.LOCAL_MODEL_BASE_URL), imageProvider: Boolean(process.env.IMAGE_PROVIDER_BASE_URL), roles: Object.keys(rolePrompts) })),
  }),
});

export type AppRouter = typeof appRouter;
