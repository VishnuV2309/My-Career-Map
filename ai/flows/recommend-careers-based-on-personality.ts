'use server';
/**
 * @fileOverview A career recommendation AI agent based on personality traits.
 *
 * - recommendCareersBasedOnPersonality - A function that handles the career recommendation process.
 * - RecommendCareersBasedOnPersonalityInput - The input type for the recommendCareersBasedOnPersonality function.
 * - RecommendCareersBasedOnPersonalityOutput - The return type for the recommendCareersBasedOnPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCareersBasedOnPersonalityInputSchema = z.object({
  personalityTraits: z
    .string()
    .describe(
      'A description of the users personality traits, derived from a psychometric assessment.'
    ),
  userSkills: z.array(z.string()).describe('A list of the user skills.'),
  lifeSkills: z.array(z.string()).describe("A description of the user's life skills (e.g., communication, teamwork)."),
  interests: z.array(z.string()).describe("A list of the user's interests and values."),
});
export type RecommendCareersBasedOnPersonalityInput = z.infer<
  typeof RecommendCareersBasedOnPersonalityInputSchema
>;

const RecommendCareersBasedOnPersonalityOutputSchema = z.object({
  careerClusters: z
    .array(
      z.object({
        cluster: z.string().describe('The name of the career cluster (e.g., "Data & AI", "Green Tech").'),
        description: z
          .string()
          .describe('A brief description of why this career cluster is a good fit.'),
        successPotential: z
          .number()
          .min(0)
          .max(100)
          .describe(
            "An estimated success potential percentage (0-100) based on the alignment of the user's profile with the career cluster."
          ),
        jobRoles: z.array(
            z.object({
                title: z.string().describe("A specific job role within this cluster."),
                matchPercentage: z.number().min(0).max(100).describe("The estimated match percentage for this specific job role.")
            })
        ).describe("A list of specific job roles within this cluster and their match percentages.")
      })
    )
    .describe('A list of recommended career clusters based on personality traits.'),
  skillGraph: z
    .array(
      z.object({
        name: z.string(),
        level: z.number().min(0).max(100),
      })
    )
    .describe("A graph of the user's skills and their estimated proficiency."),
  personalityMap: z
    .string()
    .describe("A summary of the user's personality profile."),
  interestCloud: z
    .array(z.string())
    .describe("A list of keywords representing the user's interests."),
});
export type RecommendCareersBasedOnPersonalityOutput = z.infer<
  typeof RecommendCareersBasedOnPersonalityOutputSchema
>;

export async function recommendCareersBasedOnPersonality(
  input: RecommendCareersBasedOnPersonalityInput
): Promise<RecommendCareersBasedOnPersonalityOutput> {
  return recommendCareersBasedOnPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCareersBasedOnPersonalityPrompt',
  input: {schema: RecommendCareersBasedOnPersonalityInputSchema},
  output: {schema: RecommendCareersBasedOnPersonalityOutputSchema},
  prompt: `You are a career counselor who specializes in creating a 360° profile for students and recommending career pathways.

Instead of just job titles, you will recommend broader "Career Clusters" like "Data & AI", "Green Tech", "Healthcare", "Creative Industries", etc.
For each cluster, you must also provide 2-3 specific "Job Roles" that fall under it, along with a "matchPercentage" for each role.
For each cluster, you must provide a "successPotential" score from 0-100. This score should represent the alignment between the user's profile (skills, personality, interests) and the typical requirements and environment of that career cluster. A high score indicates a strong match.
Generate a full 360° profile including a Skill Graph, a Personality Map, and an Interest Cloud.

- Personality Traits: {{{personalityTraits}}}
- User's Technical Skills: {{#if userSkills}}{{#each userSkills}} - {{{this}}}{{/each}}{{else}}None{{/if}}
- User's Life Skills: {{#if lifeSkills}}{{#each lifeSkills}} - {{{this}}}{{/each}}{{else}}None{{/if}}
- User's Interests and Values: {{#if interests}}{{#each interests}} - {{{this}}}{{/each}}{{else}}None{{/if}}

Recommend at least 3 career clusters. For each cluster, suggest 2-3 specific job roles with their match percentages. For the skill graph, estimate the user's proficiency level (0-100) based on the skills provided. The personality map should be a descriptive summary. The interest cloud should be a list of keywords.`,
});

const recommendCareersBasedOnPersonalityFlow = ai.defineFlow(
  {
    name: 'recommendCareersBasedOnPersonalityFlow',
    inputSchema: RecommendCareersBasedOnPersonalityInputSchema,
    outputSchema: RecommendCareersBasedOnPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
