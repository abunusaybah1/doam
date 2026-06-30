"use client";

import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type ProblemImage = {
  id: string;
  image_url: string;
  position: number;
};

export default function ImageGallery({
  images,
  heading,
}: {
  images: ProblemImage[];
  heading: string;
}) {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return <div className="w-full h-72 bg-surface rounded-lg" />;
  }

  function prev() {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  }

  function next() {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[0.68rem] uppercase tracking-widest text-parch">
        Photo evidence of the problem
      </p>

      <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].image_url}
          alt={`${heading} — photo ${current + 1}`}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-orange text-parch p-2 rounded-full hover:bg-ember transition-colors"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange text-parch p-2 rounded-full hover:bg-ember transition-colors"
            >
              <FiChevronRight />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-bark px-3 py-1.5 rounded-full">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-orange" : "bg-parch"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
