import Hero from "@/components/sections/Hero";
import Anatomy from "@/components/sections/Anatomy";
import Manifesto from "@/components/sections/Manifesto";
import Colorways from "@/components/sections/Colorways";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Anatomy />
      <Manifesto />
      <Colorways />
      <Footer />
    </main>
  );
}