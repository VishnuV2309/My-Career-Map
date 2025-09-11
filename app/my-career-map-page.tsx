'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import PageFooter from '@/components/page-footer';
import Hero from '@/components/hero';
import AssessmentForm from '@/components/assessment-form';
import Dashboard from '@/components/dashboard';
import type { CareerRecs, AssessmentSubmitData } from '@/lib/types';
import { getCareerRecommendations } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export type Step = 'start' | 'assessment' | 'dashboard';

export default function MyCareerMapPage() {
  const [step, setStep] = useState<Step>('start');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CareerRecs | null>(null);
  const [assessmentData, setAssessmentData] =
    useState<AssessmentSubmitData | null>(null);
  const { toast } = useToast();
  const [assessmentStep, setAssessmentStep] = useState(1);
  const totalAssessmentSteps = 4;

  const handleStart = () => {
    setStep('assessment');
    setAssessmentStep(1);
  };
  
  const handleStartOver = () => {
    setStep('start');
    setResults(null);
    setAssessmentData(null);
  }

  const handleSubmit = async (data: AssessmentSubmitData) => {
    setIsLoading(true);
    setAssessmentData(data);
    setStep('dashboard'); // Go to dashboard, which will show a skeleton
    try {
      const recommendations = await getCareerRecommendations({
        personalityTraits: data.personalityTraits,
        userSkills: data.userSkills,
        lifeSkills: data.lifeSkills,
        interests: data.interests,
      });
      setResults(recommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error getting recommendations',
        description:
          'There was a problem with our AI. Please try again later.',
      });
      setStep('assessment'); // Go back to form on error
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'start':
        return <Hero onStart={handleStart} />;
      case 'assessment':
        return (
          <AssessmentForm
            onSubmit={handleSubmit}
            step={assessmentStep}
            setStep={setAssessmentStep}
            totalSteps={totalAssessmentSteps}
          />
        );
      case 'dashboard':
        if (isLoading) {
          return <Dashboard.Skeleton />;
        }
        if (results && assessmentData) {
          return (
            <Dashboard
              careerRecs={results}
              assessmentData={assessmentData}
            />
          );
        }
        // This case handles if we land on dashboard without results (e.g. error)
        // Or if the user refreshes the page on the dashboard
        return (
          <div className="text-center py-10 md:py-20">
            <h2 className="text-2xl font-semibold mb-4">
              Oops! It looks like you've refreshed the page.
            </h2>
            <p className="text-muted-foreground mb-6">
              To see your personalized results, please start the assessment
              again.
            </p>
            <button
              onClick={handleStartOver}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md"
            >
              Start Over
            </button>
          </div>
        );
      default:
        return <Hero onStart={handleStart} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        showProgress={step === 'assessment'}
        currentStep={assessmentStep}
        totalSteps={totalAssessmentSteps}
      />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 animate-in fade-in-50 duration-500">
        {renderContent()}
      </main>
      <PageFooter showLogo={step !== 'assessment'} />
    </div>
  );
}
