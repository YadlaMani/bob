import React from "react";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { CodeBlock } from "../components/ui/code-block";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

const Home = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const code = `const QuestCreator = () => {
    const [quests, setQuests] = React.useState([]);
    const [newQuest, setNewQuest] = React.useState({ title: '', description: '' });

    const createQuest = () => {
      setQuests([...quests, newQuest]);
      setNewQuest({ title: '', description: '' });
    };

    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Create Quest</h2>
        <input
          type="text"
          value={newQuest.title}
          onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
          placeholder="Title"
          className="p-2 border rounded mb-2"
        />
        <textarea
          value={newQuest.description}
          onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
          placeholder="Description"
          className="p-2 border rounded mb-2"
        />
        <button onClick={createQuest} className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
      </div>
    );
  };
  `;

  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom...",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind...",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote: "All that we see or seem is but a dream within a dream.",
      name: "Edgar Allan Poe",
      title: "A Dream Within a Dream",
    },
    {
      quote:
        "It is a truth universally acknowledged, that a single man in possession...",
      name: "Jane Austen",
      title: "Pride and Prejudice",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little...",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
  );

  const bentoItems = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
      header: <Skeleton />,
      className: "md:col-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and functional design.",
      header: <Skeleton />,
      className: "md:col-span-1",
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "The Power of Communication",
      description:
        "Understand the impact of effective communication in our lives.",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-black">
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition z-50"
      >
        Toggle Dark Mode
      </button>
      <div className="relative z-10 min-h-screen bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
          <motion.h1
            className="text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Bob-Decentralized Data Labeling Platform
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Link businesses, researchers, and creators with global contributors
            for quality data labels and crypto rewards.
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Decentralised <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Data Ecosystem
              </span>
            </h1>
          }
        >
          <motion.img
            src="/1.png"
            alt="hero"
            width={800}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </ContainerScroll>
      </div>

      <div className="flex items-start space-x-8 p-8">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text text-white">
            Quest Creation Hub
          </h2>
          <br></br>
          <br></br>
          <p className="text-lg text-gray-600">
            This section illustrates how the decentralized platform enables
            businesses, researchers, and content creators to manage quests for
            data labeling, content rating, and market research. Contributors
            participate in quests and earn crypto rewards.
          </p>
          <p className="mt-4 text-lg text-gray-600">
            The code example below demonstrates key functionality, such as
            creating quests, collecting responses, and managing rewards. It
            provides insight into the interaction between quest creators and
            contributors in the platform.
          </p>
        </div>
        <div className="flex-1">
          <CodeBlock
            language="jsx"
            filename="Quest Creator.jsx"
            highlightLines={[9, 13, 14, 18]}
            code={code}
          />
        </div>
      </div>
      
      <div className="py-16">
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
          {bentoItems.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>

      <div className="my-16 flex justify-center items-center">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>

      <div className=" bg-gray-900 text-white">
        <div className="container mx-auto px-4 flex items-center">
          <div className="flex-1 flex justify-center">
            <img
              src="/footer.png"
              alt="Footer Logo"
              className="h-[24rem] w-auto object-cover"
            />
          </div>
          <div className="flex-1 border-l h-full border-gray-600 flex pl-8">
            <div className="space-y-4">
              <a href="#about" className="hover:text-gray-400">
                About{" "}
              </a>
              <a href="#services" className="hover:text-gray-400">
                {" "}
                Services{" "}
              </a>
              <a href="#contact" className="hover:text-gray-400">
                {" "}
                Contact{" "}
              </a>
            </div>
            <div className="space-y-4 mt-8">
              <a href="https://facebook.com" className="hover:text-gray-400">
                Facebook{" "}
              </a>
              <a href="https://twitter.com" className="hover:text-gray-400">
                {" "}
                Twitter{" "}
              </a>
              <a href="https://linkedin.com" className="hover:text-gray-400">
                {" "}
                LinkedIn{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-20 left-10 flex items-center bg-gray-800 text-white p-4 rounded-lg shadow-lg">
    <audio
      id="audioPlayer"
      className="w-full"
      controls
      autoPlay
      loop
    >
      <source src="/path-to-your-song.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
    <div className="flex items-center ml-4">
      <button
        className="text-white px-4 py-2 hover:bg-gray-600 rounded-full"
        onClick={() => document.getElementById("audioPlayer").play()}
      >
        Play
      </button>
      <button
        className="text-white px-4 py-2 hover:bg-gray-600 rounded-full"
        onClick={() => document.getElementById("audioPlayer").pause()}
      >
        Pause
      </button>
    </div>
  </div> */}
    </div>
  );
};

export default Home;
