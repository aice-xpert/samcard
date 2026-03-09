import {Hero} from "@/components/about-us/Hero";
import { InnovationSection } from "@/components/about-us/Innovation";
import { StoryMissionValues } from "@/components/about-us/StoryMissionValues";
import { TimelineSection } from "@/components/about-us/Timeline";
import { CTABanner } from "@/components/CTABanner";
import { StatsBar } from "@/components/about-us/StatsBar";
export default function AboutUs()
{
  return (
    <>
      <Hero />
      <StatsBar />
      <StoryMissionValues />
      <TimelineSection />
      <InnovationSection />
      <CTABanner />

    </>
  );
}