import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatHashtags(text: string): string {
  return text.replace(/#(\w+)/g, '<span class="text-green-500 font-medium">#$1</span>');
}
