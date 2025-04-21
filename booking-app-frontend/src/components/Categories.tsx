// src/components/Categories.tsx  

import React from 'react';  
import { motion } from 'framer-motion';  
import styled from 'styled-components';  
import { fadeInUp, staggerContainer, hoverScale } from '../lib/motionVariants.ts';

const Section = styled.section`
  padding: 3rem 0;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#1f2937' : '#ffffff')};
`;
const Container = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 1rem;
`;
const Title = styled.h2`
  font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 1.5rem;
  color: ${({ isDarkMode }) => (isDarkMode ? '#f9fafb' : '#1f2937')};
`;
const ButtonContainer = styled(motion.div)`display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;`;
const Card = styled(motion.div)`
  background: ${({ isDarkMode }) => (isDarkMode ? '#374151' : '#e5e7eb')};
  border-radius: 0.75rem; padding: 1rem; width: 200px; text-align: center;
`;
const CardImage = styled.img`max-width: 100%; border-radius: 0.5rem; margin-bottom: 0.5rem;`;
const Button = styled.button`
  padding: 0.5rem 1rem; border-radius: 9999px; transition: background-color 0.2s, color 0.2s;
  background-color: ${({ isDarkMode }) => (isDarkMode ? '#374151' : '#e5e7eb')};
  color: ${({ isDarkMode }) => (isDarkMode ? '#e5e7eb' : '#1f2937')};
  &:hover { background-color: #3b82f6; color: white; }
`;


const categories = [  
  { title: 'Graphics & Design', imgSrc: '/assets/graphics-design.jpeg' },  
  { title: 'Digital Marketing', imgSrc: '/assets/digital-marketing.jpeg' },  
  { title: 'Writing & Translation', imgSrc: '/assets/writing-translation.jpeg' },  
  { title: 'Video & Animation', imgSrc: '/assets/video-animation.jpeg' },  
  { title: 'Programming & Tech', imgSrc: '/assets/programming-tech.jpeg' },  
  { title: 'AI Services', imgSrc: '/assets/ai-services.jpeg' },  
];  

export default function Categories({ isDarkMode }: { isDarkMode: boolean }) {
    return (
      <Section isDarkMode={isDarkMode}>
        <Container>
          <Title isDarkMode={isDarkMode}>Parcourez nos catégories</Title>
          <ButtonContainer
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {categories.map(({ title, imgSrc }) => (
              <Card
                key={title}
                isDarkMode={isDarkMode}
                variants={fadeInUp}
                {...hoverScale}
              >
                <CardImage src={imgSrc} alt={title} />
                <Button isDarkMode={isDarkMode}>{title}</Button>
              </Card>
            ))}
          </ButtonContainer>
        </Container>
      </Section>
    );
  }