import { cn } from '@/lib/utils';

export function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 tech-grid-bg-light dark:tech-grid-bg-dark" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 dark:bg-primary/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 dark:bg-secondary/5 blur-[150px] rounded-full" />
    </div>
  );
}

export function HeroBackground({ heroMediaUrl }: { heroMediaUrl: string }) {
    return (
        <div className="fixed inset-0 -z-40 pointer-events-none">
            {heroMediaUrl && (
                <img
                    src={heroMediaUrl}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-15 dark:opacity-20 dark:mix-blend-luminosity"
                />
            )}
        </div>
    );
}
