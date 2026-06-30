function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export default function VideoEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.68rem] uppercase tracking-widest text-parch">
        Video showing the problem
      </p>
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-surface">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Problem video"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
