// src/components/PopularServices.tsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fadeInUp, staggerContainer, hoverScale } from '../lib/motionVariants.ts';

const Section = styled.section`padding: 3rem 0; background: ${({ isDarkMode }) => isDarkMode ? '#1f2937' : '#fff'};`;
const Container = styled.div`max-width: 1280px; margin: 0 auto; padding: 0 1rem;`;
const Title = styled.h2`
  font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 1.5rem;
  color: ${({ isDarkMode }) => (isDarkMode ? '#f9fafb' : '#1f2937')};
`;
const Grid = styled(motion.div)`
  display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem;
  @media(min-width:768px){ grid-template-columns: repeat(4,1fr); }
`;
const ServiceCard = styled(motion.div)`
  background: ${({ isDarkMode }) => isDarkMode ? '#374151' : '#f3f4f6'};
  border-radius: 0.75rem; padding: 1.5rem; text-align: center; cursor: pointer;
`;
const CardImage = styled.img`width:100%; border-radius:0.5rem; margin-bottom:1rem;`;
 

const popular = [  
  { title: 'Website Development', imgSrc: '/assets/website-development.png' },  
  { title: 'Logo Design', imgSrc: '/assets/logo-design.png' },  
  { title: 'SEO', imgSrc: '/assets/seo.png' },  
  { title: 'Video Editing', imgSrc: '/assets/video-editing.png' },  
  { title: 'Voice Over', imgSrc: '/assets/voice-over.png' },  
  { title: 'Social Media Marketing', imgSrc: '/assets/social-media-marketing.png' },  
  { title: 'E-Commerce Marketing', imgSrc: '/assets/e-commerce-marketing.png' },  
  { title: 'Data Science', imgSrc: '/assets/data-science.png' },  
];  

export default function PopularServices({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <Section isDarkMode={isDarkMode}>
      <Container>
        <Title isDarkMode={isDarkMode}>Popular Services</Title>
        <Grid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {popular.map(({ title, imgSrc }) => (
            <ServiceCard
              key={title}
              isDarkMode={isDarkMode}
              variants={fadeInUp}
              {...hoverScale}
            >
              <CardImage src={imgSrc} alt={title}/>
              <motion.p
                style={{ fontWeight: 'bold', color: isDarkMode ? '#f9fafb' : '#1f2937' }}
              >
                {title}
              </motion.p>
            </ServiceCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}