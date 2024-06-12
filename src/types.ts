export type Options = {
  dryRun?: boolean;
  junkRegex?: RegExp;
  onDelete?: (dir: string) => void;
  onDirectory?: (dir: string) => void;
  verbose?: boolean;
  filter?: (file: string, regex?: RegExp) => boolean;
};
