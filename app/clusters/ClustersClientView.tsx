"use client";
import { motion } from 'framer-motion';
import { HoverEffect } from '@/components/ui/card-hover-effect'; 

interface ClusterItem {
  title: string;
  description: string;
  imageUrl: string;
}

const clusterData: ClusterItem[] = [
    {
        imageUrl: '/images/Clusters/WD.png',
        title: 'Web Development',
        description:
            'Dive into the world of web development by building dynamic and responsive websites. Enhance your skills in both front-end and back-end technologies while working on impactful projects that elevate ACE’s online presence.',
    },
    {
        imageUrl: '/images/Clusters/AD.png',
        title: 'App Development',
        description:
            'Join the app development sub-cluster to create innovative mobile applications. Gain hands-on experience in designing and developing apps that solve real-world problems and contribute to ACE’s digital ecosystem.',
    },
    {
        imageUrl: '/images/Clusters/AIML.png',
        title: 'AI ML',
        description:
            'Members will delve into the world of AI and ML, working on projects that involve data analysis, machine learning models, and AI applications. They will stay updated with the latest trends and advancements in the field.',
    },
    {
        imageUrl: '/images/Clusters/cyber.png',
        title: 'Cybersecurity',
        description:
            'This sub-cluster is dedicated to understanding and implementing security measures to protect information systems. Members will learn about various cybersecurity practices, ethical hacking, and how to safeguard against cyber threats.',
    },
    {
        imageUrl: '/images/Clusters/Iot.png',
        title: 'IOT & Embedded Systems',
        description:
            'Members of this sub-cluster will explore the integration of hardware and software to build smart, connected systems. They will work on real-time data collection, sensor-based automation, and networked devices.',
    },
    {
        imageUrl: '/images/Clusters/CP.png',
        title: 'Competitive Programming',
        description:
            'Members will engage in competitive programming, solving complex problems and participating in coding competitions. This sub-cluster aims to enhance problem-solving skills and algorithmic thinking.',
    },
    {
        imageUrl: '/images/Clusters/GD.png',
        title: 'Graphic Designing',
        description:
            'This sub-cluster focuses on creating visually appealing graphics for posters and social media posts. Members will use their design skills to create engaging and informative visual content.',
    },
    {
        imageUrl: '/images/Clusters/video.png',
        title: 'Video Editing',
        description:
            'Members will be responsible for editing videos for various ACE events and promotional materials. They will use their editing skills to create professional and engaging video content.',
    },
    {
        imageUrl: '/images/Clusters/CW.png',
        title: 'Content Writing',
        description:
            "This sub-cluster focuses on writing content for various media, including blogs, social media posts, and promotional materials. Members will use their writing skills to convey ACE's message clearly and professionally.",
    },
    {
        imageUrl: '/images/Clusters/Opcon.png',
        title: 'OpCon',
        description:
            'Members of this sub-cluster will ensure that all events and activities run smoothly. They will be responsible for the logistical aspects of events, ensuring that everything is well-organized and executed efficiently.',
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
      <div className="mb-8 text-center">
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
      </div>

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
