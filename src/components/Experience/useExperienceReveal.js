import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function useExperienceReveal(sectionRef) {
    useEffect(() => {
        const section = sectionRef.current;

        if (
            !section ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return undefined;
        }

        const targets = section.querySelectorAll("[data-experience-reveal]");

        if (targets.length === 0) {
            return undefined;
        }

        const context = gsap.context(() => {
            gsap.fromTo(
                targets,
                { y: 14 },
                {
                    y: 0,
                    duration: 0.58,
                    stagger: 0.07,
                    ease: "power2.out",
                    immediateRender: false,
                    clearProps: "transform",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 84%",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }, section);

        return () => context.revert();
    }, [sectionRef]);
}

export default useExperienceReveal;
