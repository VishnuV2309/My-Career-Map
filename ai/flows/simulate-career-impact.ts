'use server';
/**
 * @fileOverview Simulates the impact of learning a new skill on a user's career path.
 *
 * - simulateCareerImpact - A function that simulates career impact.
 * - SimulateCareerImpactInput - The input type for the simulateCareerImpact function.
 * - SimulateCareerImpactOutput - The return type for the simulateCareerImpact function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SimulateCareerImpactInputSchema = z.object({
  currentSkills: z
    .array(z.string())
    .describe("The user's current set of skills."),
  newSkill: z.string().describe('The new skill the user is considering learning.'),
  timeline: z
    .string()
    .describe('The timeline for learning the new skill (e.g., "3 months").'),
});

export type SimulateCareerImpactInput = z.infer<
  typeof SimulateCareerImpactInputSchema
>;

const EmergingRoleSchema = z.object({
  role: z.string().describe('The title of the emerging job role.'),
  description: z
    .string()
    .describe('A brief description of why this role is a good fit.'),
});

const SimulateCareerImpactOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the impact of learning the new skill on the user’s career path.'
    ),
  emergingRoles: z
    .array(EmergingRoleSchema)
    .describe('A list of potential new roles that open up.'),
});

export type SimulateCareerImpactOutput = z.infer<
  typeof SimulateCareerImpactOutputSchema
>;

export async function simulateCareerImpact(
  input: SimulateCareerImpactInput
): Promise<SimulateCareerImpactOutput> {
  return simulateCareerImpactFlow(input);
}

const simulateCareerImpactPrompt = ai.definePrompt({
  name: 'simulateCareerImpactPrompt',
  input: { schema: SimulateCareerImpactInputSchema },
  output: { schema: SimulateCareerImpactOutputSchema },
  prompt: `You are a forward-thinking career analyst. A user wants to know the impact of learning a new skill.

Analyze how adding the "new skill" to their "current skills" within the specified "timeline" could transform their career prospects.

Provide:
1.  A concise summary of the potential impact.
2.  A list of 2-3 specific, emerging job roles that would become accessible. For each role, explain why it's a good fit given the combined skillset.

Current Skills: {{#if currentSkills}}{{#each currentSkills}} - {{{this}}}{{/each}}{{else}}None{{/if}}
New Skill: {{{newSkill}}}
Timeline: {{{timeline}}}

Generate a structured analysis.`,
});

const simulateCareerImpactFlow = ai.defineFlow(
  {
    name: 'simulateCareerImpactFlow',
    inputSchema: SimulateCareerImpactInputSchema,
    outputSchema: SimulateCareerImpactOutputSchema,
  },
  async (input) => {
    const { output } = await simulateCareerImpactPrompt(input);
    return output!;
  }
);
