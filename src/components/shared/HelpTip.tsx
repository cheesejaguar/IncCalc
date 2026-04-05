'use client';

import { GLOSSARY } from '@/lib/data/glossary';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface HelpTipProps {
  /** Glossary key to look up, or custom text */
  term: string;
  /** Optional override for tooltip text (instead of glossary lookup) */
  text?: string;
  /** Show as inline icon (default) or underlined text */
  variant?: 'icon' | 'underline';
  /** Children to wrap (for underline variant) */
  children?: React.ReactNode;
}

/**
 * Contextual help tooltip. Looks up game terms from the glossary.
 *
 * Usage:
 *   <HelpTip term="DEFCON" />                    -- shows info icon with tooltip
 *   <HelpTip term="DEFCON" variant="underline">  -- wraps children with tooltip
 *     DEFCON Level
 *   </HelpTip>
 *   <HelpTip term="" text="Custom explanation" /> -- custom text
 */
export function HelpTip({ term, text, variant = 'icon', children }: HelpTipProps) {
  const entry = GLOSSARY[term];
  const tipText = text || entry?.short || term;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className={
            variant === 'underline'
              ? 'underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 cursor-help'
              : 'inline-flex items-center cursor-help'
          }
        >
          {variant === 'underline' ? (
            children ?? term
          ) : (
            <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
          )}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
          {tipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
