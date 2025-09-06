import { useEffect, useRef, useState } from "react";

export interface ISong {
  title: string;
  artist: string;
  id: string;
  duration: number;
}

const songs: ISong[] = [
  {
    title: "Memori Baik",
    artist: "Sheila on 7",
    id: "memori-baik.mp3",
    duration: 240,
  },
  {
    title: "Feel Good Inc",
    artist: "Gorillaz",
    id: "feel-good-inc.mp3",
    duration: 240,
  },
];

export type TrackState = "played" | "paused" | "stoped";

export default function PlayPage() {
  return (
    <>
      {songs.map((song) => (
        <Song song={song} key={song.id} />
      ))}
    </>
  );
}

function formatTime(time: number) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

function Song({ song }: { song: ISong }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [played, setPlayed] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [trackState, setTrackState] = useState<TrackState>("stoped");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const interval = setInterval(() => {
      setPlayed(audio.currentTime || 0);
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const playedPercent = (played / song.duration) * 100;
  const bufferedPercent = (buffered / song.duration) * 100;

  const togglePlay = () => {
    if (trackState === "stoped" || trackState === "paused") {
      audioRef.current?.play();
      setTrackState("played");
    }
    if (trackState === "played") {
      audioRef.current?.pause();
      setTrackState("paused");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 px-4">
      <div className="flex flex-col gap-2">
        <p>{`${song.title} - ${song.artist}`}</p>

        <div className="flex gap-3 w-full  ">
          <button
            className="rounded-full w-8 h-8 bg-red-500 items-center p-2 cursor-pointer"
            onClick={togglePlay}
          >
            {trackState === "paused" || trackState === "stoped" ? (
              <IconPlay />
            ) : (
              <IconPause />
            )}
          </button>
          <div className="w-full  h-full mt-2">
            <div className="relative h-2 bg-white rounded-full overflow-hidden">
              {/* Gray bar for downloaded */}
              <div
                className="absolute left-0 top-0 h-full bg-gray-400"
                style={{ width: `${bufferedPercent}%` }}
              />
              {/* Red bar for played */}
              <div
                className="absolute left-0 top-0 h-full bg-red-500"
                style={{ width: `${playedPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{formatTime(played)}</span>
              <span>{formatTime(song.duration)}</span>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          /* controls */
          /* autoPlay */
          src={`${song.id}`}
        />
      </div>
    </div>
  );
}

const IconPause = () => {
  return (
    <svg
      fill="#FFFFFF"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#FFFFFF"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>pause</title>{" "}
        <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>{" "}
      </g>
    </svg>
  );
};

const IconPlay = () => {
  return (
    <svg
      fill="#FFFFFF"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#FFFFFF"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <title>play</title>{" "}
        <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>{" "}
      </g>
    </svg>
  );
};
