"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl: string;
  moodName: string;
}

export function AudioPlayer({ audioUrl, moodName }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showAutoplayOverlay, setShowAutoplayOverlay] = useState(true);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const audioType = getAudioMimeType(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioType) {
      const canPlay = audio.canPlayType(audioType);
      if (!canPlay) {
        setPlaybackError("Unsupported audio format or source.");
        setShowAutoplayOverlay(false);
        return;
      }
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioType]);

  const handlePlayClick = () => {
    if (audioRef.current) {
      if (playbackError) return;
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          setShowAutoplayOverlay(true);
        });
        setShowAutoplayOverlay(false);
      }
    }
  };

  const handleUnmuteClick = () => {
    if (audioRef.current) {
      if (playbackError) return;
      audioRef.current.play();
      setShowAutoplayOverlay(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="w-full space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setPlaybackError("Unsupported audio format or source.");
          setShowAutoplayOverlay(false);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }}
      />

      {playbackError && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-center">
          <p className="text-sm text-rose-900">{playbackError}</p>
        </div>
      )}

      {showAutoplayOverlay && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-900 mb-3">
            Chưa bật âm thanh do trình duyệt chặn tự động phát
          </p>
          <Button onClick={handleUnmuteClick} size="sm">
            Phát nhạc {moodName}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          onClick={handlePlayClick}
          variant="outline"
          size="sm"
          className="shrink-0 bg-transparent"
        >
          {isPlaying ? "Tạm dừng" : "Phát"}
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs text-muted-foreground">Âm lượng</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

const getAudioMimeType = (url: string): string | null => {
  const withoutQuery = url.split("?")[0];
  const ext = withoutQuery.split(".").pop()?.toLowerCase();
  if (!ext) return null;

  switch (ext) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    default:
      return null;
  }
};
