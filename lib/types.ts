import { z } from 'zod';

export type AssessmentSubmitData = {
  personalityTraits: string;
  userSkills: string[];
  lifeSkills: string[];
  interests: string[];
  userExperience: string;
  learningStyle: string;
};

export type CareerRecs = {
  careerClusters: {
    cluster: string;
    description: string;
    successPotential: number;
    jobRoles: {
      title: string;
      matchPercentage: number;
    }[];
  }[];
  skillGraph: {
    name:string;
    level: number;
  }[];
  personalityMap: string;
  interestCloud: string[];
};

export type Resource = {
  name: string;
  type: 'free' | 'paid';
  url: string;
};

export type RoadmapStep = {
  title: string;
  resources: Resource[];
};

export type RoadmapPhase = {
  title: string;
  steps: RoadmapStep[];
};

export type GapAnalysis = {
  existingSkills: string[];
  missingSkills: string[];
  summary: string;
};

export type Roadmap = {
  roadmap: RoadmapPhase[];
  gapAnalysis: GapAnalysis;
};

export type Mentor = {
  name: string;
  title: string;
  company: string;
  expertise: string[];
  reason: string;
};

export type CareerExplanation = {
  title: string;
  summary: string;
  dayInTheLife: string;
  coreSkills: string[];
  futureOutlook: string;
};

export type CareerImpactSimulation = {
  summary: string;
  emergingRoles: {
    role: string;
    description: string;
  }[];
};
