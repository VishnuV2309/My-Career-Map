'use server';
/**
 * @fileOverview Suggests mentors for a given career path.
 *
 * - suggestMentors - A function that suggests mentors.
 * - SuggestMentorsInput - The input type for the suggestMentors function.
 * - SuggestMentorsOutput - The return type for the suggestMentors function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestMentorsInputSchema = z.object({
  careerPath: z.string().describe('The career path for which to suggest mentors.'),
  userSkills: z.array(z.string()).describe('A list of the user’s current skills.'),
});

export type SuggestMentorsInput = z.infer<typeof SuggestMentorsInputSchema>;

const MentorSchema = z.object({
    name: z.string().describe("The mentor's name."),
    title: z.string().describe("The mentor's current job title."),
    company: z.string().describe("The mentor's current company."),
    expertise: z.array(z.string()).describe("A list of the mentor's areas of expertise."),
    reason: z.string().describe('A brief explanation of why this mentor is a good match.'),
});

const SuggestMentorsOutputSchema = z.object({
    mentors: z.array(MentorSchema).describe('A list of suggested mentors.'),
});

export type SuggestMentorsOutput = z.infer<typeof SuggestMentorsOutputSchema>;


export async function suggestMentors(
    input: SuggestMentorsInput
): Promise<SuggestMentorsOutput> {
    return suggestMentorsFlow(input);
}


const suggestMentorsPrompt = ai.definePrompt({
    name: 'suggestMentorsPrompt',
    input: { schema: SuggestMentorsInputSchema },
    output: { schema: SuggestMentorsOutputSchema },
    prompt: `You are a career matchmaking expert. Based on the user's chosen career path and skills, suggest 3-4 potential mentors.

For each mentor, create a realistic but fictional profile, including their name, title, company, areas of expertise, and a personalized reason why they would be a great mentor for the user.
The suggested mentors should be highly relevant to the user's career path and skills.

Career Path: {{{careerPath}}}
User Skills: {{#if userSkills}}{{#each userSkills}} - {{{this}}}{{/each}}{{else}}None{{/if}}

Generate a list of suggested mentors.`,
});


const suggestMentorsFlow = ai.defineFlow(
    {
        name: 'suggestMentorsFlow',
        inputSchema: SuggestMentorsInputSchema,
        outputSchema: SuggestMentorsOutputSchema,
    },
    async input => {
        const { output } = await suggestMentorsPrompt(input);
        return output!;
    }
);
