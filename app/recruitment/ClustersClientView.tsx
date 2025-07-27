"use client";
import { motion } from 'framer-motion';
import { HoverEffect } from './ui/card-hover-effect'; 

interface ClusterItem {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
}

const clusterData: ClusterItem[] = [
    {
        imageUrl: '/images/Clusters/WD.png',
        title: 'Web Development',
        link:'https://www.youtube.com/',
    },
    {
        imageUrl: '/images/Clusters/AD.png',
        title: 'App Development',
    },
    {
        imageUrl: '/images/Clusters/AIML.png',
        title: 'AI ML',
       
    },
    {
        imageUrl: '/images/Clusters/cyber.png',
        title: 'Cybersecurity',
        
    },
    {
        imageUrl: '/images/Clusters/Iot.png',
        title: 'IOT & Embedded Systems',
       
    },
    {
        imageUrl: '/images/Clusters/CP.png',
        title: 'Competitive Programming',
       
    },
    {
        imageUrl: '/images/Clusters/GD.png',
        title: 'Graphic Designing',
        
    },
    {
        imageUrl: '/images/Clusters/video.png',
        title: 'Video Editing',
      
    },
    {
        imageUrl: '/images/Clusters/CW.png',
        title: 'Content Writing',
       
    },
    {
        imageUrl: '/images/Clusters/Opcon.png',
        title: 'OpCon',
       
    },
];

export default function ClustersClientView() { 
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  // HoverEffect likely has its own animation, so a separate grid variant might not be needed
  // unless you want to animate the grid container itself before HoverEffect's animations.
  const hoverEffectContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4, // Starts after the title begins animating (0.2) and overlaps slightly
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* <div className="mb-8 text-center">
        <motion.h1
          className="text-3xl font-bold text-foreground sm:text-4xl md:text-[40px] md:leading-[1.2]"
          variants={titleVariants}
        >
          Our Clusters
        </motion.h1>
        <motion.p
          className="mt-3 text-lg text-muted-foreground sm:mt-4"
          variants={titleVariants}
        >
          Explore our diverse clusters, each led by dedicated individuals.
        </motion.p>
      </div> */}

      {/* HoverEffect component will render the grid and items */}
      {/* It might have its own internal motion variants for items */}
      <motion.div
        variants={hoverEffectContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <HoverEffect items={clusterData} />
      </motion.div>
    </motion.div>
  );
}
