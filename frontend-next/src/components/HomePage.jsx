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
import Footer from "./Footer";

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
      imageUrl: "/test1.png", 
      altText: "Charles Dickens",
    },
    {
      imageUrl: "/test2.png", 
      altText: "William Shakespeare",
    },
    {
      imageUrl: "/test3.png", 
      altText: "Edgar Allan Poe",
    },
    {
      imageUrl: "/test4.png", 
      altText: "Jane Austen",
    },
    {
      imageUrl: "/test5.png", 
      altText: "Herman Melville",
    },
  ];
  
  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border border-transparent"></div>
  );

  const bentoItems = [
    {
      title: "Solana-Powered Payments",
      description:
        "Instant, low-cost cross-border payouts with secure Solana transactions.",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
      image: "/g1.png",
    },
    {
      title: "Variety of Datasets",
      description:
        "Collect and label diverse datasets for AI, research, and market analysis",
      header: <Skeleton />,
      className: "md:col-span-1",
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
      image: "/g4.png",
    },
    {
      title: " Data Collection & Analysis",
      description:
        "Real-time insights, analytics, and exportable reports for AI-ready data..",
      header: <Skeleton />,
      className: "md:col-span-1",
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      image: "/g3.png",
    },
    {
      title: "Cross-Border Payments",
      description:
        "Fast, low-cost Solana transactions for seamless global contributor payouts",
      header: <Skeleton />,
      className: "md:col-span-2",
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      image: "/g2.png",
    },
  ];

  return (
    <div className="relative min-h-screen ">
      <Head>
        <title>BOB - Decentralized Data Ecosystem</title>
        <meta
          name="description"
          content="Link businesses, researchers, and creators with global contributors for quality data labels and crypto rewards."
        />
      </Head>

      <div className="relative z-10 min-h-screen bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
          <motion.h1
            className="text-4xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="dark:text-primary">Bob</span>-Decentralized
          </motion.h1>
          <motion.p
            className="mt-4 text-3xl text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Crowdsourced Intelligence, Blockchain-Powered Rewards
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
              src="/dash.png"
              alt="hero"
              width={1000}
              height={1000}
              className="rounded-lg object-cover"
            />
          </motion.div>
        </ContainerScroll>
      </div>

      <div className="flex items-start space-x-8 p-8">
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold text-black dark:text-white bg-clip-text">
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
        <h2 className="text-5xl font-extrabold text-center text-black dark:text-white mb-8">
          Why<span className="dark:text-primary"> Bob</span>
        </h2>
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
          {bentoItems.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
              image={item.image}
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
      <Footer />
    </div>
  );
};

export default HomePage;
