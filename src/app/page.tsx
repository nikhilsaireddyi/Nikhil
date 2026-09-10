import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { About } from '@/components/sections/About';
import { Toolkit } from '@/components/sections/Toolkit';
import { Journey } from '@/components/sections/Journey';
import { Projects } from '@/components/sections/Projects';
import { Lab } from '@/components/sections/Lab';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main id="main-content" className="relative flex flex-col w-full">
      <Hero />
      <Manifesto />
      <About />
      <Toolkit />
      <Journey />
      <Projects />
      <Lab />
      <Contact />
    </main>
  );
}
