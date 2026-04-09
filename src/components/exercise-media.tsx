import type { ExerciseDef } from "@/types";
import { MediaPlaceholder } from "@/components/media-placeholder";

function youtubeEmbedUrl(url: string): string | null {
  const watch = url.match(/[?&]v=([\w-]{11})/);
  if (watch) return `https://www.youtube-nocookie.com/embed/${watch[1]}`;
  const shortu = url.match(/youtu\.be\/([\w-]{11})/);
  if (shortu) return `https://www.youtube-nocookie.com/embed/${shortu[1]}`;
  const embed = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (embed) return `https://www.youtube-nocookie.com/embed/${embed[1]}`;
  return null;
}

function vimeoEmbedUrl(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

const frameClass =
  "aspect-video w-full max-w-full rounded-2xl border border-border/80 bg-black shadow-sm";

/** Mostra vídeo quando `exercise.videoUrl` está definido em `exercises.ts`; senão o placeholder. */
export function ExerciseMedia({ exercise }: { exercise: ExerciseDef }) {
  const raw = exercise.videoUrl?.trim();
  if (!raw) {
    return <MediaPlaceholder />;
  }

  const yt = youtubeEmbedUrl(raw);
  if (yt) {
    return (
      <iframe
        className={frameClass}
        src={yt}
        title={`Vídeo: ${exercise.title}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  const vm = vimeoEmbedUrl(raw);
  if (vm) {
    return (
      <iframe
        className={frameClass}
        src={vm}
        title={`Vídeo: ${exercise.title}`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  if (/\.mp4(\?|$)/i.test(raw)) {
    return (
      <video
        className={frameClass}
        controls
        playsInline
        preload="metadata"
        aria-label={`Vídeo: ${exercise.title}`}
      >
        <source src={raw} type="video/mp4" />
        Seu navegador não suporta vídeo HTML5.
      </video>
    );
  }

  return (
    <MediaPlaceholder label="Formato de vídeo não reconhecido — use YouTube, Vimeo ou .mp4" />
  );
}
