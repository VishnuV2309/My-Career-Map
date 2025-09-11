'use client';

import { useState, useMemo, useEffect, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  BarChart,
  Book,
  Brain,
  CheckCircle,
  Cloud,
  DollarSign,
  ExternalLink,
  Loader2,
  Map,
  Rocket,
  Target,
  Clock,
  Award,
  Users,
  Share2,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Briefcase,
  TrendingUp,
  ListChecks,
  Info,
  Building2,
} from 'lucide-react';
import type {
  CareerRecs,
  Roadmap,
  AssessmentSubmitData,
  RoadmapPhase,
  RoadmapStep,
  Mentor,
  CareerExplanation,
  GapAnalysis,
} from '@/lib/types';
import {
  getLearningRoadmap,
  getMentorSuggestions,
  getCareerExplanation,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart as RechartsBarChart,
} from 'recharts';
import { ChartTooltipContent, ChartContainer } from './ui/chart';
import { cn } from '@/lib/utils';
import { CircularProgress } from './circular-progress';
import { ScrollArea } from './ui/scroll-area';

type DashboardContextType = {
  assessmentData: AssessmentSubmitData;
  careerRecs: CareerRecs;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  return useContext(DashboardContext);
}

type DashboardProps = {
  careerRecs: CareerRecs;
  assessmentData: AssessmentSubmitData;
};

type ClientRoadmapStep = RoadmapStep & {
  completed: boolean;
};

type ClientRoadmapPhase = {
  title: string;
  steps: ClientRoadmapStep[];
  completed: boolean;
};

type TimelineOption = '3 months' | '6 months' | '1 year';
const timelineOptions: TimelineOption[] = ['3 months', '6 months', '1 year'];

function processRoadmap(roadmap: Roadmap): ClientRoadmapPhase[] {
  return roadmap.roadmap.map(phase => ({
    ...phase,
    steps: phase.steps.map(step => ({
      ...step,
      completed: false,
    })),
    completed: false,
  }));
}

const badgeTiers = {
  1: { name: 'Phase 1 Finisher', icon: <Award className="w-5 h-5 text-yellow-500" /> },
  2: { name: 'Phase 2 Conqueror', icon: <Award className="w-5 h-5 text-slate-400" /> },
  3: { name: 'Phase 3 Master', icon: <Award className="w-5 h-5 text-amber-300" /> },
  default: { name: 'Roadmap Rockstar', icon: <Award className="w-5 h-5 text-primary" /> },
};

export default function Dashboard({
  careerRecs,
  assessmentData,
}: DashboardProps) {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null);
  const [clientRoadmap, setClientRoadmap] = useState<ClientRoadmapPhase[]>([]);
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [selectedTimeline, setSelectedTimeline] =
    useState<TimelineOption>('3 months');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoadingMentors, setIsLoadingMentors] = useState(false);
  const [isMentorExplanationOpen, setIsMentorExplanationOpen] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<CareerExplanation | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);


  const { toast } = useToast();

  const recommendations = useMemo(
    () => careerRecs.careerClusters,
    [careerRecs]
  );
  
  const handleGenerateMentors = useCallback(async (career: string) => {
    setIsLoadingMentors(true);
    try {
      const result = await getMentorSuggestions({
        careerPath: career,
        userSkills: assessmentData.userSkills,
      });
      setMentors(result.mentors);
    } catch(e) {
       toast({
        variant: 'destructive',
        title: 'Error suggesting mentors',
        description:
          'There was a problem suggesting mentors for you. Please try again.',
      });
    } finally {
      setIsLoadingMentors(false);
    }
  }, [assessmentData, toast]);


  const handleGenerateRoadmap = useCallback(async (
    career: string,
    timeline: TimelineOption,
    isUserClick: boolean = true
  ) => {
    if (isUserClick) {
      setSelectedCareer(career);
      setSelectedTimeline(timeline);
    }
    setIsLoadingRoadmap(true);
    setRoadmapData(null);
    setClientRoadmap([]);
    setMentors([]);
    
    handleGenerateMentors(career);

    try {
      const result = await getLearningRoadmap({
        careerPath: career,
        userSkills: assessmentData.userSkills,
        userExperience: assessmentData.userExperience,
        learningStyle: assessmentData.learningStyle,
        timeline: timeline,
      });
      setRoadmapData(result);
      setClientRoadmap(processRoadmap(result));
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error generating roadmap',
        description:
          'There was a problem generating the learning roadmap. Please try again.',
      });
    } finally {
      setIsLoadingRoadmap(false);
    }
  }, [assessmentData, toast, handleGenerateMentors]);


  useEffect(() => {
    if (recommendations.length > 0 && !selectedCareer) {
      const firstCareer = recommendations[0].cluster;
      setSelectedCareer(firstCareer);
      handleGenerateRoadmap(firstCareer, selectedTimeline, false);
    }
  }, [recommendations, selectedCareer, handleGenerateRoadmap, selectedTimeline]);


  const handleStepToggle = (phaseIndex: number, stepIndex: number) => {
    const newClientRoadmap = [...clientRoadmap];
    const phase = newClientRoadmap[phaseIndex];
    phase.steps[stepIndex].completed = !phase.steps[stepIndex].completed;

    if (phase.steps.every(step => step.completed)) {
        phase.completed = true;
    } else {
        phase.completed = false;
    }

    setClientRoadmap(newClientRoadmap);
  };
  
  const handleExplainCareer = async (career: string) => {
    setIsExplanationLoading(true);
    setIsMentorExplanationOpen(true);
    setCurrentExplanation(null);
    try {
      const result = await getCareerExplanation({ career });
      setCurrentExplanation(result.explanation);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error explaining career',
        description:
          'There was a problem explaining this career. Please try again.',
      });
      setIsMentorExplanationOpen(false);
    } finally {
      setIsExplanationLoading(false);
    }
  };


  const totalSteps = useMemo(
    () => clientRoadmap.reduce((sum, phase) => sum + phase.steps.length, 0),
    [clientRoadmap]
  );
  const completedSteps = useMemo(
    () =>
      clientRoadmap.reduce(
        (sum, phase) =>
          sum + phase.steps.filter(step => step.completed).length,
        0
      ),
    [clientRoadmap]
  );
  
  const completedPhases = useMemo(() => clientRoadmap.filter(p => p.completed), [clientRoadmap]);

  const progressPercentage =
    totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const skillsData = useMemo(
    () => careerRecs.skillGraph,
    [careerRecs.skillGraph]
  );

  const chartConfig = useMemo(() => {
    const config: any = {};
    skillsData.forEach(skill => {
      config[skill.name] = {
        label: skill.name,
      };
    });
    return config;
  }, [skillsData]);

  const gapAnalysis = useMemo(() => roadmapData?.gapAnalysis, [roadmapData]);

  const dashboardContextValue = useMemo(() => ({
    assessmentData,
    careerRecs
  }), [assessmentData, careerRecs]);

  return (
    <DashboardContext.Provider value={dashboardContextValue}>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Target className="text-primary" /> Career Clusters
            </CardTitle>
            <CardDescription>
              Based on your assessment, here are your top career clusters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map(({ cluster, description, successPotential, jobRoles }) => (
              <Accordion type="single" collapsible key={cluster}>
                <AccordionItem value={cluster} className="border-b-0">
                  <Card
                    className={`mb-2 transition-all ${
                      selectedCareer === cluster
                        ? 'border-primary shadow-primary/20'
                        : ''
                    }`}
                  >
                    <AccordionTrigger
                      className="p-4 text-lg font-semibold hover:no-underline"
                      onClick={() => {
                        if (selectedCareer !== cluster) {
                           handleGenerateRoadmap(cluster, selectedTimeline)
                        }
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full transition-colors ${
                              selectedCareer === cluster
                                ? 'bg-primary/10'
                                : 'bg-muted'
                            }`}
                          >
                            <Rocket
                              className={`w-5 h-5 transition-colors ${
                                selectedCareer === cluster
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <span className="text-base text-left">{cluster}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CircularProgress value={successPotential} />
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            Potential
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground">{description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-primary/80" />
                            Potential Job Roles
                        </h4>
                        <div className="space-y-2">
                          {jobRoles.map(role => (
                            <div key={role.title} className="text-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span>{role.title}</span>
                                <span className="font-bold text-primary">{role.matchPercentage}%</span>
                              </div>
                              <Progress value={role.matchPercentage} className="h-1.5" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExplainCareer(cluster)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask AI Mentor
                      </Button>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <BarChart className="text-primary" /> Skill Graph
            </CardTitle>
            <CardDescription>
              Your estimated proficiency in key areas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <RechartsBarChart
                accessibilityLayer
                data={skillsData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="level"
                  radius={[0, 4, 4, 0]}
                  fill="hsl(var(--primary))"
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Brain className="text-primary" /> Personality Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {careerRecs.personalityMap}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Cloud className="text-primary" /> Interest Cloud
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {careerRecs.interestCloud.map(interest => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <Card className="shadow-xl shadow-primary/10 sticky top-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                      <Map className="text-primary" /> Your Learning Roadmap
                    </CardTitle>
                    <CardDescription>
                      Your personalized, AI-generated plan to achieve your career goals.
                      {selectedCareer && (
                        <span className="font-semibold text-primary block mt-1">{` For: ${selectedCareer}`}</span>
                      )}
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2 flex-shrink-0">
                    <Clock className="w-5 h-5 text-muted-foreground hidden sm:block" />
                    <div className="flex gap-1">
                        {timelineOptions.map(option => (
                        <Button
                            key={option}
                            size="sm"
                            variant={selectedTimeline === option ? 'default' : 'outline'}
                            onClick={() => {
                                if (selectedCareer) {
                                    handleGenerateRoadmap(selectedCareer, option)
                                }
                            }}
                            className="text-xs"
                        >
                            {option}
                        </Button>
                        ))}
                    </div>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingRoadmap ? (
              <div className="flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="font-semibold">Generating your roadmap...</p>
                <p className="text-sm">
                  Our AI is crafting the perfect plan for you.
                </p>
              </div>
            ) : clientRoadmap.length > 0 ? (
              <div className="space-y-6">
                {gapAnalysis && (
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ListChecks className="text-primary" />
                        Skill Gap Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground italic p-3 bg-background rounded-md flex items-start gap-2">
                        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{gapAnalysis.summary}</span>
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">Your Existing Skills</h4>
                          <ul className="space-y-1 list-disc list-inside">
                            {gapAnalysis.existingSkills.map(skill => (
                              <li key={skill} className="text-green-600">
                                <span className="text-muted-foreground">{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Skills to Acquire</h4>
                          <ul className="space-y-1 list-disc list-inside">
                            {gapAnalysis.missingSkills.map(skill => (
                              <li key={skill} className="text-amber-600">
                                <span className="text-muted-foreground">{skill}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Overall Progress</p>
                    <p className="text-sm font-bold text-primary">
                      {Math.round(progressPercentage)}%
                    </p>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
                <Accordion
                  type="multiple"
                  className="w-full space-y-2"
                  defaultValue={clientRoadmap.map(p => p.title)}
                >
                  {clientRoadmap.map((phase, phaseIndex) => (
                    <AccordionItem
                      key={phase.title}
                      value={phase.title}
                      className="border-b-0"
                    >
                      <Card className="mb-2 bg-muted/20">
                        <AccordionTrigger className="p-4 text-lg font-semibold hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                <Rocket className="w-5 h-5 text-primary" />
                                </div>
                                {phase.title}
                            </div>
                            {phase.completed && (
                                <Badge variant="default" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Completed
                                </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                          <div className="space-y-4">
                            {phase.steps.map((step, stepIndex) => (
                              <div
                                key={step.title}
                                className={`p-4 rounded-md transition-colors ${
                                  step.completed
                                    ? 'bg-primary/5'
                                    : 'bg-background'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() =>
                                      handleStepToggle(phaseIndex, stepIndex)
                                    }
                                    className="mt-1"
                                  >
                                    <CheckCircle
                                      className={`w-5 h-5 shrink-0 transition-colors ${
                                        step.completed
                                          ? 'text-primary'
                                          : 'text-muted-foreground/50'
                                      }`}
                                    />
                                  </button>
                                  <div className="flex-1">
                                    <p
                                      className={`font-medium ${
                                        step.completed
                                          ? 'text-muted-foreground line-through'
                                          : ''
                                      }`}
                                    >
                                      {step.title}
                                    </p>
                                    <div className="mt-3 space-y-2">
                                      <h4 className="text-sm font-semibold">
                                        Recommended Resources:
                                      </h4>
                                      <ul className="space-y-2">
                                        {step.resources.map(resource => (
                                          <li
                                            key={resource.url}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
                                          >
                                            <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                              {resource.type === 'paid' ? (
                                                <DollarSign className="w-4 h-4 text-amber-500" />
                                              ) : (
                                                <Book className="w-4 h-4 text-green-500" />
                                              )}
                                              <span>{resource.name}</span>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              asChild
                                            >
                                              <Link
                                                href={resource.url}
                                                target="_blank"
                                              >
                                                View
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                              </Link>
                                            </Button>
                                          </li>
                                        ))}
                                      </ul>
                                      <div className="pt-2">
                                        <Button size="sm" variant="outline">
                                            <Share2 className="w-4 h-4 mr-2" />
                                            Share Project
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 gap-4 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Book className="w-12 h-12" />
                <p className="font-semibold">
                  Select a career cluster to generate your roadmap
                </p>
                <p className="text-sm max-w-xs">
                  Choose one of your career matches to see a step-by-step
                  learning plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {completedPhases.length > 0 && (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Award className="text-primary" /> Badges Earned
                    </CardTitle>
                    <CardDescription>
                        Your achievements on your learning journey.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                    {completedPhases.map((phase, index) => {
                        const tier = (badgeTiers as any)[index + 1] || badgeTiers.default;
                        return (
                            <div key={phase.title} className="flex flex-col items-center gap-2 text-center p-4 border rounded-lg bg-muted/20 w-32">
                                {tier.icon}
                                <p className="font-semibold text-sm">{tier.name}</p>
                                <p className="text-xs text-muted-foreground">Completed: {phase.title}</p>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        )}

        {selectedCareer && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Users className="text-primary" /> Mentor Connect
              </CardTitle>
              <CardDescription>
                AI-powered suggestions for mentors in {selectedCareer}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMentors ? (
                <div className="flex items-center justify-center h-40 gap-2 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <p>Finding mentors...</p>
                </div>
              ) : mentors.length > 0 ? (
                <div className="space-y-4">
                    {mentors.map(mentor => (
                        <div key={mentor.name} className="flex items-start gap-4 p-3 border rounded-lg bg-background">
                            <div className="flex-1">
                                <p className="font-bold">{mentor.name}</p>
                                <p className="text-sm text-muted-foreground">{mentor.title} at {mentor.company}</p>
                                <p className="text-xs mt-2 p-2 bg-primary/5 rounded-md flex items-start gap-2">
                                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                                  <span><span className="font-semibold">Match Reason:</span> {mentor.reason}</span>
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {mentor.expertise.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground h-40 flex items-center justify-center">No mentor suggestions available at this time.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    
    <Dialog open={isMentorExplanationOpen} onOpenChange={setIsMentorExplanationOpen}>
        <DialogContent className="max-w-2xl">
          <ScrollArea className="max-h-[80vh]">
            <div className="p-1 pr-6">
              <DialogHeader>
                  <DialogTitle>
                      {isExplanationLoading ? 'AI Mentor is thinking...' : currentExplanation?.title}
                  </DialogTitle>
                  {isExplanationLoading ? (
                    <div className="flex flex-col items-center justify-center h-96 gap-4 text-muted-foreground">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="font-semibold">AI Mentor is thinking...</p>
                        <p className="text-sm">Please wait a moment.</p>
                    </div>
                  ) : currentExplanation ? (
                    <>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-3xl flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-primary" />
                            {currentExplanation.title}
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-base">
                            {currentExplanation.summary}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                <Briefcase className="w-5 h-5 text-primary/80" /> A Day in the Life
                            </h3>
                            <p className="text-muted-foreground">{currentExplanation.dayInTheLife}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-primary/80" /> Core Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentExplanation.coreSkills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-primary/80" /> Future Outlook
                            </h3>
                            <p className="text-muted-foreground">{currentExplanation.futureOutlook}</p>
                        </div>
                    </div>
                    </>
                ) : null}
              </DialogHeader>
            </div>
          </ScrollArea>
        </DialogContent>
    </Dialog>
    </DashboardContext.Provider>
  );
}

Dashboard.Skeleton = function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-pulse">
      <div className="lg:col-span-1 space-y-8">
        <div className="h-48 bg-muted rounded-lg"></div>
        <div className="h-64 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
      <div className="lg:col-span-2 h-[40rem] bg-muted rounded-lg"></div>
    </div>
  );
};
