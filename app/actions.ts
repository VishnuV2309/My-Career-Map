'use server';

import {
  recommendCareersBasedOnPersonality,
  RecommendCareersBasedOnPersonalityInput,
  RecommendCareersBasedOnPersonalityOutput,
} from '@/ai/flows/recommend-careers-based-on-personality';
import {
  generatePersonalizedLearningRoadmap,
  GeneratePersonalizedLearningRoadmapInput,
  GeneratePersonalizedLearningRoadmapOutput,
} from '@/ai/flows/generate-personalized-learning-roadmap';
import {
  suggestMentors,
  SuggestMentorsInput,
  SuggestMentorsOutput,
} from '@/ai/flows/suggest-mentors';
import {
  explainCareer,
  ExplainCareerInput,
  ExplainCareerOutput,
} from '@/ai/flows/explain-career';
import {
  simulateCareerImpact,
  SimulateCareerImpactInput,
  SimulateCareerImpactOutput,
} from '@/ai/flows/simulate-career-impact';

export async function getCareerRecommendations(
  input: RecommendCareersBasedOnPersonalityInput
): Promise<RecommendCareersBasedOnPersonalityOutput> {
  return await recommendCareersBasedOnPersonality(input);
}

export async function getLearningRoadmap(
  input: GeneratePersonalizedLearningRoadmapInput
): Promise<GeneratePersonalizedLearningRoadmapOutput> {
  return await generatePersonalizedLearningRoadmap(input);
}

export async function getMentorSuggestions(
  input: SuggestMentorsInput
): Promise<SuggestMentorsOutput> {
  return await suggestMentors(input);
}

export async function getCareerExplanation(
  input: ExplainCareerInput
): Promise<ExplainCareerOutput> {
  return await explainCareer(input);
}

export async function getCareerImpactSimulation(
  input: SimulateCareerImpactInput
): Promise<SimulateCareerImpactOutput> {
  return await simulateCareerImpact(input);
}
