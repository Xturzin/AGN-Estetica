type ClassValue = string | false | null | undefined;

export function cx(...args: ClassValue[]): string {
  return args.filter(Boolean).join(" ");
}