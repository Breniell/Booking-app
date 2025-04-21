// src/components/TrustedBy.tsx  

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fadeInUp, staggerContainer, hoverScale } from '../lib/motionVariants.ts';

const Section = styled.section`padding:3rem 0; background:${({ theme }) => theme.mode==='dark'? '#1f2937':'#f9fafb'};`;
const Container = styled.div`max-width:1280px; margin:0 auto; padding:0 1rem; text-align:center;`;
const TrustedText = styled.p`
  text-transform:uppercase; font-size:0.875rem; font-weight:500; margin-bottom:1.5rem;
  color:${({ theme }) => theme.mode==='dark'? '#9ca3af':'#6b7280'};
`;
const LogosContainer = styled(motion.div)`
  display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:2rem;
`;
const Logo = styled(motion.img)`height:2rem; object-fit:contain;`;


const logos = [  
  '/assets/meta.png',  
  '/assets/Google_2015_logo.svg',  
  '/assets/netflix.png',  
  '/assets/paypal.png',  
  '/assets/payoneer.png'  
];  

export default function TrustedBy() {
  return (
    <Section>
      <Container>
        <TrustedText>Trusted by</TrustedText>
        <LogosContainer
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {logos.map((src,i) => (
            <Logo
              key={i}
              src={src}
              alt=""
              variants={fadeInUp}
              {...hoverScale}
            />
          ))}
        </LogosContainer>
      </Container>
    </Section>
  );
}  