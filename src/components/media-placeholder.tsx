export function MediaPlaceholder({ label = "Vídeo ou ilustração" }: { label?: string }) {
  return (
    <div
      className="aspect-video w-full rounded-2xl border-2 border-dashed border-border bg-accent/40 flex flex-col items-center justify-center gap-2 text-muted text-sm px-4 text-center"
      role="img"
      aria-label={label}
    >
      <span className="text-2xl opacity-40" aria-hidden>
        ▶
      </span>
      <span>{label}</span>
      <span className="text-xs opacity-70">Área reservada para multimédia</span>
    </div>
  );
}
