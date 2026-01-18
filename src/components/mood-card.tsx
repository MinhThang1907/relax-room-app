"use client";

import type { Mood } from "@/domain/mood";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MutableRefObject } from "react";
import { useRef, useState } from "react";

let activeAudioRef: MutableRefObject<HTMLAudioElement | null> | null = null;
let activeStop: (() => void) | null = null;

interface MoodCardProps {
  mood: Mood;
  onListen?: () => void;
  onCreateRoom: (moodId: string) => void;
}

export function MoodCard({ mood, onListen, onCreateRoom }: MoodCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (activeAudioRef === audioRef) {
      activeAudioRef = null;
    }
    if (activeStop === stopCurrentAudio) {
      activeStop = null;
    }
    setIsPlaying(false);
  };

  const handleListen = () => {
    if (!mood.audioUrl) return;

    if (isPlaying) {
      stopCurrentAudio();
    } else {
      if (activeStop && activeStop !== stopCurrentAudio) {
        activeStop();
      }
      const audio = new Audio(mood.audioUrl);
      audioRef.current = audio;
      activeAudioRef = audioRef;
      activeStop = stopCurrentAudio;
      setIsPlaying(true);
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      audio.onended = () => {
        if (audioRef.current === audio) {
          audioRef.current = null;
          if (activeAudioRef === audioRef) {
            activeAudioRef = null;
          }
          setIsPlaying(false);
        }
      };
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{mood.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {mood.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {mood.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {mood.audioUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleListen}
              className="flex-1 bg-transparent"
            >
              {isPlaying ? "⏸ Dừng" : "▶ Nghe thử"}
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => onCreateRoom(mood.id)}
            className="flex-1"
          >
            Tạo phòng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
