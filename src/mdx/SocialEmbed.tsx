"use client";

import { Tweet } from "react-tweet";

type EmbedProps = {
  readonly id: string;
  readonly className?: string;
};

type YouTubeEmbedProps = EmbedProps & {
  readonly title?: string;
};

export function TweetEmbed({ id, className = "" }: EmbedProps) {
  return (
    <div className={`my-8 flex justify-center not-prose ${className}`}>
      <div className="max-w-[550px] w-full">
        <Tweet id={id} />
      </div>
    </div>
  );
}

export function YouTubeEmbed({
  id,
  title = "YouTube video",
  className = "",
}: YouTubeEmbedProps) {
  return (
    <div className={`my-8 not-prose ${className}`}>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </div>
  );
}

export function InstagramEmbed({ id, className = "" }: EmbedProps) {
  return (
    <div className={`my-8 flex justify-center not-prose ${className}`}>
      <div className="max-w-[550px] w-full">
        <iframe
          src={`https://www.instagram.com/p/${id}/embed`}
          className="w-full border-0 rounded-xl overflow-hidden"
          style={{ minHeight: "500px" }}
          scrolling="no"
          title="Instagram post"
        />
      </div>
    </div>
  );
}
