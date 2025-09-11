// src/ai/flows/generate-personalized-learning-roadmap.ts
'use server';
/**
 * @fileOverview Generates a personalized learning roadmap for a chosen career path.
 *
 * - generatePersonalizedLearningRoadmap - A function that generates a personalized learning roadmap.
 * - GeneratePersonalizedLearningRoadmapInput - The input type for the generatePersonalizedLearningRoadmap function.
 * - GeneratePersonalizedLearningRoadmapOutput - The return type for the generatePersonalizedLearningRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedLearningRoadmapInputSchema = z.object({
  careerPath: z
    .string()
    .describe('The chosen career path for which to generate a learning roadmap.'),
  userSkills: z.array(z.string()).describe('A list of the user’s current skills.'),
  userExperience: z
    .string()
    .describe('A description of the user’s prior experience.'),
  learningStyle: z
    .string()
    .describe('The user’s preferred learning style (e.g., visual, practical, theory-oriented).'),
  timeline: z.string().describe('The desired timeline to complete the roadmap (e.g., "3 months", "6 months", "1 year").'),
});

export type GeneratePersonalizedLearningRoadmapInput = z.infer<
  typeof GeneratePersonalizedLearningRoadmapInputSchema
>;

const ResourceSchema = z.object({
  name: z.string().describe('The name of the resource.'),
  type: z.enum(['free', 'paid']).describe('The type of the resource (free or paid).'),
  url: z.string().url().describe('The URL to the resource.'),
});

const RoadmapStepSchema = z.object({
  title: z.string().describe('The title of the learning step or milestone.'),
  resources: z
    .array(ResourceSchema)
    .describe('A list of recommended resources for this step.'),
});

const RoadmapPhaseSchema = z.object({
    title: z.string().describe('The title of the roadmap phase (e.g., "Phase 1: Foundations").'),
    steps: z.array(RoadmapStepSchema).describe('A list of steps within this phase.')
})

const GeneratePersonalizedLearningRoadmapOutputSchema = z.object({
  gapAnalysis: z.object({
    existingSkills: z.array(z.string()).describe("A list of the user's existing skills that are relevant to the career path."),
    missingSkills: z.array(z.string()).describe("A list of skills the user needs to acquire for the career path."),
    summary: z.string().describe("A brief summary of the user's skill gap."),
  }).describe("An analysis of the user's skill gap for the chosen career."),
  roadmap: z.array(RoadmapPhaseSchema).describe('A personalized learning roadmap with actionable steps, broken down into phases.'),
});

export type GeneratePersonalizedLearningRoadmapOutput = z.infer<
  typeof GeneratePersonalizedLearningRoadmapOutputSchema
>;

export async function generatePersonalizedLearningRoadmap(
  input: GeneratePersonalizedLearningRoadmapInput
): Promise<GeneratePersonalizedLearningRoadmapOutput> {
  return generatePersonalizedLearningRoadmapFlow(input);
}

const generatePersonalizedLearningRoadmapPrompt = ai.definePrompt({
  name: 'generatePersonalizedLearningRoadmapPrompt',
  input: {schema: GeneratePersonalizedLearningRoadmapInputSchema},
  output: {schema: GeneratePersonalizedLearningRoadmapOutputSchema},
  prompt: `You are an expert career counselor specializing in creating personalized learning roadmaps and skill gap analysis.

  First, perform a skill gap analysis. Identify the core skills needed for the specified career path. Compare these with the user's current skills. List the relevant skills the user already has and the key skills they are missing. Provide a short summary of this analysis.

  Then, based on the user's chosen career path, current skills, prior experience, learning style, and desired timeline, generate a structured, phased learning roadmap.
  Each phase should represent a logical block of learning (e.g., "Phase 1: Foundations", "Phase 2: Core Skills", "Phase 3: Advanced Topics & Specialization").
  Each phase must contain several clear, actionable steps (milestones).
  Each step should include at least one free and one paid resource recommendation (e.g., NPTEL for free; Coursera, Udemy, LinkedIn Learning for paid).
  The resource recommendations should be tailored to the user's learning style.

  The roadmap should be realistically achievable within the given timeline.
  - For a 3-month timeline, create 3-4 phases.
  - For a 6-month timeline, create 5-6 phases.
  - For a 1-year timeline, create 8-12 phases.

  Career Path: {{{careerPath}}}
  User Skills: {{{userSkills}}}
  User Experience: {{{userExperience}}}
  Learning Style: {{{learningStyle}}}
  Timeline: {{{timeline}}}

  Generate a structured gap analysis and roadmap. Ensure all provided resource URLs are valid and working. For YouTube, prefer linking to established channels, popular tutorials, or full courses rather than single, obscure videos. Double-check that the links are not broken or private.`,
});

const generatePersonalizedLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningRoadmapFlow',
    inputSchema: GeneratePersonalizedLearningRoadmapInputSchema,
    outputSchema: GeneratePersonalizedLearningRoadmapOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedLearningRoadmapPrompt(input);
    return output!;
  }
);
