// src/pages/Home.jsx
import HeroSection from '@/features/ui/home/HeroSection';
import InfoStrip from '@/features/ui/home/InfoStrip';
import FeaturedCollections from '@/features/ui/home/FeaturedCollections';
import StorySection from '@/features/ui/home/StorySection';
import Testimonials from '@/features/ui/home/Testimonials';
import Newsletter from '@/features/ui/home/Newsletter';
import MediaShowcase from '@/features/ui/home/MediaShowcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <InfoStrip />
      <FeaturedCollections />
      <StorySection />
      <Testimonials />
      <Newsletter />
      <MediaShowcase />
    </div>
  );
}
