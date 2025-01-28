import React from 'react';

// For YouTube videos
const YouTubeVideo = ({ videoId }: { videoId: string }) => {
    return (
        <div className="relative w-full pt-[56.25%]">
            <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

// For local/hosted videos
const LocalVideo = ({ src }: { src: string }) => {
    return (
        <div className="relative w-full">
            <video
                className="w-full"
                controls
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

// Main Video component that handles both types
export default function Video({
    type = 'local',
    source,
}: {
    type?: 'youtube' | 'local',
    source: string
}) {
    // Extract YouTube video ID from URL if needed
    const getYouTubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match ? match[1] : null;
    };

    if (type === 'youtube') {
        const videoId = getYouTubeId(source);
        if (!videoId) {
            return <div>Invalid YouTube URL</div>;
        }
        return <YouTubeVideo videoId={videoId} />;
    }

    return <LocalVideo src={source} />;
}