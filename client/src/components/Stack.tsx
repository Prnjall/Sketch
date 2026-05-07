'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Stack.css';

interface CardItem {
  id: number;
  content: React.ReactNode;
}

interface StackProps {
  cards: React.ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  animationConfig?: {
    stiffness: number;
    damping: number;
  };
}

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag: boolean;
}

const CardRotate: React.FC<CardRotateProps> = ({
  children,
  onSendToBack,
  sensitivity,
  disableDrag,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPressed || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = (e.clientY - centerY) / sensitivity;
    const rotateY = (e.clientX - centerX) / sensitivity;

    ref.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (ref.current) {
      ref.current.style.transform = '';
    }
  };

  useEffect(() => {
    if (isPressed) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPressed]);

  return (
    <div
      ref={ref}
      className={disableDrag ? 'card-rotate-disabled' : 'card-rotate'}
      onMouseDown={() => {
        if (!disableDrag) setIsPressed(true);
        onSendToBack();
      }}
      onClick={() => {
        if (disableDrag) onSendToBack();
      }}
    >
      {children}
    </div>
  );
};

const Stack: React.FC<StackProps> = ({
  cards,
  randomRotation = false,
  sensitivity = 180,
  sendToBackOnClick = true,
  autoplay = false,
  autoplayDelay = 3500,
  pauseOnHover = false,
  animationConfig = { stiffness: 260, damping: 20 },
}) => {
  const [stack, setStack] = useState<CardItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const shouldDisableDrag = !sendToBackOnClick;
  const shouldEnableClick = sendToBackOnClick;

  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, content })));
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack(prev => {
      const newStack = [...prev];
      const index = newStack.findIndex(card => card.id === id);
      if (index === -1) return prev;
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  return (
    <div
      className="stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        // Stable pseudo-random rotation based on card id so it doesn't jump on re-render
        const randomRotate = randomRotation ? ((card.id * 137.5) % 10) - 5 : 0;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="card"
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%',
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
};

export default Stack;
