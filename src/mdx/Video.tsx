type VideoProps = {
  readonly src: string;
  readonly caption?: string;
  readonly poster?: string;
  readonly className?: string;
};

export function Video({ src, caption, poster, className = "" }: VideoProps) {
  return (
    <figure className={`my-8 ${className}`}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="w-full rounded-xl"
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
