export default function LiveBadge({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse2" aria-hidden="true" />
      {label}
    </span>
  );
}
