'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { AssessmentSubmitData } from '@/lib/types';
import { useState } from 'react';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  // Step 1: About You
  groupProject: z.string().optional(),
  energizedBy: z.string().optional(),
  decisionMaking: z.string().optional(),

  // Step 2: Skills & Interests
  techSkills: z.string().optional(),
  interests: z.array(z.string()).optional(),

  // Step 3: Experience
  experience: z.string().optional(),
  learningStyle: z.string().optional(),

  // Step 4: Life Skills
  lifeSkills: z.array(z.string()).optional(),
});

type AssessmentFormProps = {
  onSubmit: (data: AssessmentSubmitData) => void;
  step: number;
  setStep: (step: number) => void;
  totalSteps: number;
};

const personalityQuestions = [
  {
    name: 'groupProject',
    label: 'When faced with a group project, you prefer to...',
    options: [
      { value: 'Lead and organize', trait: 'conscientious and detail-oriented' },
      { value: 'Brainstorm ideas', trait: 'creative and open to new ideas' },
      { value: 'Work on tasks quietly', trait: 'introverted and focused' },
      { value: 'Maintain harmony', trait: 'empathetic and collaborative' },
    ],
  },
  {
    name: 'energizedBy',
    label: 'You are more energized by...',
    options: [
      { value: 'Large groups', trait: 'extroverted and sociable' },
      { value: 'Small, deep conversations', trait: 'introverted and thoughtful' },
      { value: 'Working alone', trait: 'independent and self-sufficient' },
      { value: 'A mix of both', trait: 'adaptable' },
    ],
  },
  {
    name: 'decisionMaking',
    label: 'When making decisions, you rely more on...',
    options: [
      { value: 'Logic and data', trait: 'analytical and logical' },
      { value: 'Gut feeling and people', trait: 'intuitive and empathetic' },
      { value: 'Past experiences', trait: 'practical and cautious' },
      { value: 'New possibilities', trait: 'open-minded and forward-thinking' },
    ],
  },
] as const;

const interestItems = [
  { id: 'social-impact', label: 'Social Impact' },
  { id: 'entrepreneurship', label: 'Entrepreneurship' },
  { id: 'research', label: 'Research' },
  { id: 'corporate', label: 'Corporate' },
] as const;

const lifeSkillsItems = [
  { id: 'communication', label: 'Communication' },
  { id: 'teamwork', label: 'Teamwork' },
  { id: 'adaptability', label: 'Adaptability' },
  { id: 'problem-solving', label: 'Problem Solving' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'time-management', label: 'Time Management' },
] as const;

export default function AssessmentForm({
  onSubmit,
  step,
  setStep,
  totalSteps,
}: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupProject: '',
      energizedBy: '',
      decisionMaking: '',
      techSkills: '',
      interests: [],
      experience: '',
      learningStyle: '',
      lifeSkills: [],
    },
  });

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const traitMap = Object.fromEntries(
        personalityQuestions.flatMap(q =>
            q.options.map(opt => [opt.value, opt.trait])
        )
    );

    const personalityTraits = [
        values.groupProject ? traitMap[values.groupProject] : '',
        values.energizedBy ? traitMap[values.energizedBy] : '',
        values.decisionMaking ? traitMap[values.decisionMaking] : '',
    ].filter(Boolean).join(', ');

    const userSkills = values.techSkills ? values.techSkills.split(',').map(s => s.trim()) : [];

    await onSubmit({
      personalityTraits,
      userSkills,
      lifeSkills: values.lifeSkills || [],
      interests: values.interests || [],
      userExperience: values.experience || 'No prior experience provided.',
      learningStyle: values.learningStyle || 'practical',
    });
  }

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">About You</CardTitle>
              <CardDescription>
                Let's start with a few questions to understand your work style
                and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {personalityQuestions.map(q => (
                <FormField
                  key={q.name}
                  control={form.control}
                  name={q.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-base">
                        {q.label}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                        >
                          {q.options.map(opt => (
                            <FormItem key={opt.value}>
                              <FormControl>
                                <RadioGroupItem
                                  value={opt.value}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  'flex items-center justify-center p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
                                  field.value === opt.value &&
                                    'border-primary bg-primary/10'
                                )}
                              >
                                {opt.value}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Skills & Interests
              </CardTitle>
              <CardDescription>
                Tell us about your technical skills and what you're passionate
                about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="techSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      Your Technical Skills
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. JavaScript, Python, Data Analysis"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      I am interested in...
                    </FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {interestItems.map(item => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={checked => {
                                      const currentValue = field.value || [];
                                      return checked
                                        ? field.onChange([
                                            ...currentValue,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            currentValue?.filter(
                                              value => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Experience & Learning Style
              </CardTitle>
              <CardDescription>
                Describe your background and how you like to learn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      Your Experience (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly describe your work or project experience."
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="learningStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      Preferred Learning Style
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                      >
                        {[
                          { value: 'visual', label: 'Visual (videos, diagrams)' },
                          { value: 'practical', label: 'Practical (projects)' },
                          { value: 'theory-oriented', label: 'Theoretical (reading)' },
                        ].map(opt => (
                          <FormItem key={opt.value}>
                            <FormControl>
                              <RadioGroupItem
                                value={opt.value}
                                className="sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              className={cn(
                                'flex items-center justify-center p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors h-full',
                                field.value === opt.value &&
                                  'border-primary bg-primary/10'
                              )}
                            >
                              {opt.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      case 4:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Life Skills Evaluation
              </CardTitle>
              <CardDescription>
                Select the life skills you are most confident in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="lifeSkills"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {lifeSkillsItems.map(item => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="lifeSkills"
                          render={({ field }) => (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-lg"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={checked => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([
                                          ...currentValue,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          currentValue?.filter(
                                            value => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage className="pt-4" />
                  </FormItem>
                )}
              />
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="shadow-2xl shadow-primary/10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {renderStep()}
            <CardFooter className="flex-col gap-4 items-stretch px-6 pb-6">
              <div className="flex justify-end w-full">
                {step < totalSteps && (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNextStep}
                  >
                    Next Step
                  </Button>
                )}
                {step === totalSteps && (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-bold text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Bot className="mr-2 h-5 w-5" />
                    )}
                    Generate My Career Map
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
