import Link from 'next/link';
import { Button } from './ui/button';
import { Logo } from './logo';
import { Progress } from './ui/progress';

type PageHeaderProps = {
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
};

export default function PageHeader({
  showProgress = false,
  currentStep = 1,
  totalSteps = 4,
}: PageHeaderProps) {
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex-1 flex justify-center items-center px-4 sm:px-8">
          {showProgress && (
            <div className="w-full max-w-sm md:max-w-md">
              <div className='relative'>
                <Progress value={progressValue} className="h-2" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="w-10"></div>
      </div>
    </header>
  );
}
