import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="p-2 bg-primary text-primary-foreground rounded-lg">
        <Compass className="w-6 h-6" />
      </div>
      <span className="font-headline text-2xl font-bold tracking-tighter">
        MyCareerMap
      </span>
    </div>
  );
}
