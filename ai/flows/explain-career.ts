'use server';
/**
 * @fileOverview Explains a career path in detail.
 *
 * - explainCareer - A function that provides a detailed explanation of a career.
 * - ExplainCareerInput - The input type for the explainCareer function.
 * - ExplainCareerOutput - The return type for the explainCareer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainCareerInputSchema = z.object({
  career: z.string().describe('The career path to explain.'),
});

export type ExplainCareerInput = z.infer<typeof ExplainCareerInputSchema>;

const ExplainCareerOutputSchema = z.object({
  explanation: z.object({
    title: z.string().describe('The title of the career.'),
    summary: z.string().describe('A brief summary of the career.'),
    dayInTheLife: z.string().describe('A description of a typical day.'),
    coreSkills: z.array(z.string()).describe('A list of core skills required.'),
    futureOutlook: z.string().describe('The future outlook for this career.'),
  }),
});

export type ExplainCareerOutput = z.infer<typeof ExplainCareerOutputSchema>;

export async function explainCareer(
  input: ExplainCareerInput
): Promise<ExplainCareerOutput> {
  return explainCareerFlow(input);
}

const explainCareerPrompt = ai.definePrompt({
  name: 'explainCareerPrompt',
  input: { schema: ExplainCareerInputSchema },
  output: { schema: ExplainCareerOutputSchema },
  prompt: `You are an expert career counselor and AI Mentor. A user wants to understand a specific career path better.

Provide a detailed and easy-to-understand explanation for the following career: {{{career}}}

Your explanation should include:
1.  A one-paragraph summary of what the role entails.
2.  A "Day in the Life" description, outlining typical daily tasks and responsibilities.
3.  A list of 3-5 core skills that are essential for success in this role.
4.  A brief "Future Outlook" section discussing the career's growth potential and trends.

Generate a structured explanation.`,
});

const explainCareerFlow = ai.defineFlow(
  {
    name: 'explainCareerFlow',
    inputSchema: ExplainCareerInputSchema,
    outputSchema: ExplainCareerOutputSchema,
  },
  async (input) => {
    const { output } = await explainCareerPrompt(input);
    return output!;
  }
);
