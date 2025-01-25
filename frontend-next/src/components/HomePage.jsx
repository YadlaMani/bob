"use client";
import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/ui/code-block";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

const HomePage = () => {
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
  };`;

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
      <Head>
        <title>BOB - Decentralized Data Ecosystem</title>
        <meta
          name="description"
          content="Link businesses, researchers, and creators with global contributors for quality data labels and crypto rewards."
        />
      </Head>
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition z-50"
      >
        Toggle Dark Mode
      </button>

      <div className="relative z-10 min-h-screen bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center dark:bg-black bg-white"></div>
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
          <motion.div
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <Image
              src="/1.png"
              alt="hero"
              width={800}
              height={500}
              className="rounded-lg"
            />
          </motion.div>
        </ContainerScroll>
      </div>

      <div className="flex items-start space-x-8 p-8">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-transparent bg-clip-text text-white">
            Quest Creation Hub
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            This section illustrates how the decentralized platform enables
            businesses, researchers, and content creators to manage quests for
            data labeling, content rating, and market research. Contributors
            participate in quests and earn crypto rewards.
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
    </div>
  );
};

export default HomePage;
