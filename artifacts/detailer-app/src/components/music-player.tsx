import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music2, X, Volume2, VolumeX } from "lucide-react";

const TRACKS = [
  {
    title: "Driving Beat",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Chill Cruise",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    title: "Garage Vibes",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  },
];

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
  }, [muted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const nextTrack = () => {
    setTrackIndex((i) => (i + 1) % TRACKS.length);
    setPlaying(false);
    setTimeout(async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setPlaying(true);
        } catch {
          /* ignore */
        }
      }
    }, 50);
  };

  const current = TRACKS[trackIndex];

  return (
    <>
      <audio
        ref={audioRef}
        src={current.url}
        onEnded={nextTrack}
        preload="none"
      />

      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-3 min-w-[220px]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Music2 className="w-3.5 h-3.5 text-primary" />
                  Player
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition"
                  aria-label="Fechar player"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-sm text-foreground font-medium truncate mb-3">
                {current.title}
              </div>

              <div className="flex items-center justify-between gap-2">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2 font-semibold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(204,0,0,0.25)]"
                >
                  {playing ? (
                    <>
                      <Pause className="w-4 h-4" /> Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Tocar
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setMuted((m) => !m)}
                  className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center text-foreground"
                  aria-label="Mudo"
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={nextTrack}
                  className="h-10 px-3 rounded-lg bg-background border border-border text-xs uppercase tracking-wider text-foreground"
                >
                  Próx.
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((o) => !o)}
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-[0_0_25px_rgba(204,0,0,0.45)] flex items-center justify-center relative"
          aria-label="Abrir player de música"
        >
          {playing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Music2 className="w-5 h-5" />
            </motion.div>
          ) : (
            <Music2 className="w-5 h-5" />
          )}
          {playing && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
          )}
        </motion.button>
      </div>
    </>
  );
}
