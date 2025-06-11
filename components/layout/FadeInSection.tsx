"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function FadeInSection ({
    children,
    direction = "right", // or "left"
}:{
    children: React.ReactNode;
    direction?:"left"|"right";
}) {
    const controls = useAnimation();
    const [ref, inView ] = useInView({ threshold: 0.2 });
    const offsetX = direction === "left" ? -50 : 50;

    useEffect(()=>{
        if(inView){
            controls.start({
                opacity: 1,
                x:0,
                transition: { duration: 0.6, ease: "easeOut" },
            });
        }
    }, [controls, inView]);

    return (
        <motion.div 
        ref={ref}
        initial={{ opacity:0, x: offsetX }}
        animate={controls}
        >
            {children}
        </motion.div>
    );
}