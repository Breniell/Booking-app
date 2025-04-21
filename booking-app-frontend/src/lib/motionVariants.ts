// src/lib/motionVariants.ts
export const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  
  export const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  export const hoverScale = {
    whileHover: { scale: 1.03, transition: { duration: 0.3 } },
  };
  