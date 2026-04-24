import React, { useEffect, useRef, useState } from 'react';
import './FadeIn.css';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'none';
}

export function FadeIn({ children, delay = 0, direction = 'up' }: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    // Intersection Observer to detect when the element is visible in the viewport
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Triggers when 10% of the element is visible
        });

        // Observe the element
        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        // Cleanup the observer
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    // Return the element with the fade-in class
    return (
        <div
            // Add the fade-in class and the direction class based on the direction prop
            ref={domRef}
            className={`fade-in-section ${isVisible ? 'is-visible' : ''} direction-${direction}`}
            // Add the delay to the transition
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
