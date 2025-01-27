import { useState, useEffect } from 'react';

const slides = [
  {
    title: "Capturing Moments,",
    subtitle: "Creating Memories",
    image: "https://www.bettermoments.no/wp-content/uploads/2019/10/Snowmobile-twillight-3_-1024x687.jpg"
  },
  {
    title: "Share Stories,",
    subtitle: "Connect Lives",
    image: "https://www.bettermoments.no/wp-content/uploads/2022/11/DSCF8991-1024x683.jpg"
  },
  {
    title: "Explore Beauty,",
    subtitle: "Find Wonder",
    image: "https://www.bettermoments.no/wp-content/uploads/2014/01/Bl%C3%A5lys-av-hiorthfjell-1024x683.jpg"
  }
];

export const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-purple-900/80" />
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-20 left-10 right-10">
            <h2 className="text-4xl font-semibold text-white mb-2">{slide.title}</h2>
            <p className="text-4xl font-semibold text-white">{slide.subtitle}</p>
            <div className="carousel-dots">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};