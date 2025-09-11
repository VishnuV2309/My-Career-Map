import { Logo } from './logo';

type PageFooterProps = {
  showLogo?: boolean;
};

export default function PageFooter({ showLogo = true }: PageFooterProps) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {showLogo ? (
          <Logo />
        ) : (
          <div /> // Empty div to keep alignment
        )}
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} MyCareerMap. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
