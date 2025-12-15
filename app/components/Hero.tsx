import { useState, useEffect } from "react";
import { Link } from "react-router";

const images = [
  "/assets/images/hero-carousel-1.png",
  "/assets/images/hero-carousel-2.png",
  "/assets/images/hero-carousel-3.jpeg",
  "/assets/images/hero-carousel-4.png",
  "/assets/images/hero-carousel-5.png",
];
const extendedImages = [...images, images[0]]; // Add first image to end for smooth loop

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Handle auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]); // Reset timer when index changes (user interaction)

  useEffect(() => {
    // If we've reached the cloned first image (at the end)
    if (currentIndex === images.length) {
      // Wait for the transition to finish
      const timeout = setTimeout(() => {
        // Disable transition to snap back instantly
        setIsTransitioning(false);
        // Reset to the real first image
        setCurrentIndex(0);
      }, 700); // Must match the CSS duration

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  useEffect(() => {
    // If transition is disabled (meaning we just snapped back), re-enable it
    if (!isTransitioning) {
      // Use a small timeout to ensure the DOM has updated with the new position
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    // If we are on the clone (visually index 0) and user clicks index 0, do nothing/snap
    if (currentIndex === images.length && index === 0) {
      setIsTransitioning(false);
      setCurrentIndex(0);
      return;
    }

    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  return (
    <div className="min-w-[402px] mt-[72px]">
      {/* Carousel wrapper: keeps slides and dots isolated so adding text below won't push dots */}
      <div className="relative w-full overflow-hidden">
        <div
          className={`flex h-full ${isTransitioning ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {extendedImages.map((img, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={img}
                alt={`Slide ${index === images.length ? 1 : index + 1}`}
                className="w-[370px] md:w-[712px] mt-4 mx-auto object-cover rounded-xl"
              />
              {/* Overlay for better text readability if needed */}
              <div className="absolute inset-0"></div>
            </div>
          ))}
        </div>

        {/* Dots Navigation pinned inside the carousel wrapper */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex % images.length === index
                  ? "bg-[#D4AF37] w-6"
                  : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Text and buttons below the carousel (outside the carousel wrapper) */}
      <div className="mt-7 text-center">
        <h1 className="text-[28px] text-[#3D2645] font-bold uppercase">
          Slay Your Style
        </h1>
        <p className="mt-3 font-lato text-[#3D2645] text-[14px] font-semibold">
          Luxury Bags | K-Beauty | Exclusive Collections
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            className="bg-[#D4AF37] font-lato font-bold text-[14px] text-[#3D2645] px-5 py-3 rounded-lg hover:bg-[#b8962e] transition-colors"
            to="/categories#new-arrivals"
          >
            Shop New Arrivals
          </Link>
          <Link
            className="bg-[#D4A5A5] font-lato text-[14px] text-[#3D2645] px-5 py-3 rounded-lg font-bold hover:bg-[#b68d8d] hover:text-white transition-colors"
            to="/categories"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
