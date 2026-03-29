"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrailer } from "@/lib/hooks/useTrailer";

interface TrailerModalProps {
  title: string;
  tmdbVideoKey?: string;
}

export default function TrailerModal({ title, tmdbVideoKey }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useTrailer(tmdbVideoKey ? null : title);

  const videoId = tmdbVideoKey ?? data?.trailer?.videoId;

  if (!videoId && !tmdbVideoKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-sm font-medium text-[var(--text-primary)] hover:bg-white/20 transition-colors backdrop-blur-sm"
      >
        ▶ Watch Trailer
      </button>

      <AnimatePresence>
        {isOpen && videoId && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-10 right-0 p-2 text-white/70 hover:text-white transition-colors z-10"
                aria-label="Close trailer"
              >
                <X size={24} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={`${title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
