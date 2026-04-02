import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://cdn.poehali.dev/projects/b8f90900-54d6-43ed-95ca-030774b3eb05/files/852b9997-0155-4804-9b85-93ca42271ab9.jpg"
          alt="Minecraft landscape"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          KAYOS TEAM
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto px-6 opacity-90">
          Лучшие карты и моды для Minecraft PE — скачивай, исследуй, играй
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="#catalog" className="bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 uppercase text-sm tracking-wide transition-colors duration-300">
            Смотреть каталог
          </a>
          <a href="#upload" className="border border-white text-white hover:bg-white hover:text-black font-bold px-8 py-3 uppercase text-sm tracking-wide transition-colors duration-300">
            Загрузить мод
          </a>
        </div>
      </div>
    </div>
  );
}