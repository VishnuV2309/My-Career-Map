'use client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot } from 'lucide-react';
import Image from 'next/image';

type HeroProps = {
  onStart: () => void;
};

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="text-center py-12 md:py-24 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-50"></div>

      <div className="relative z-10">
        <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm mb-4 flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Powered by Generative AI
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Navigate Your Future with
          <span className="text-primary"> MyCareerMap</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
          Unlock your potential with AI-driven career recommendations and a
          personalized learning roadmap. Your journey to a fulfilling career
          starts here.
        </p>
        <Button onClick={onStart} size="lg" className="font-bold group">
          Start Your Free Assessment
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="mt-12 md:mt-16 relative">
          <Image
            src="https://picsum.photos/1200/500"
            alt="Dashboard preview"
            data-ai-hint="dashboard professional"
            width={1200}
            height={500}
            className="rounded-xl shadow-2xl shadow-primary/10 ring-1 ring-black/5 mx-auto"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
