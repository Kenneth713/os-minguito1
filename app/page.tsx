"use client";
import React, { useState, useEffect } from "react";
// Removed Next.js imports (Link, Image, Head) to resolve environment errors

// --- Skill Data Interfaces ---
interface Skill {
  name: string;
  icon: string; // Emoji or simple character for representation
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

// Portfolio item type
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  link: string;
  image: string;
  openInNewTab: boolean;
}

// UI Style Constants (Updated for Neon Cyberpunk Theme)
const BACKGROUND_COLOR = "bg-[#030107]"; // Deep Black / Dark Violet
const CARD_BG_COLOR = "bg-[#0F0A18]"; // Dark Card Background
const ACCENT_PRIMARY_COLOR = "text-[#E033FF]"; // Electric Magenta/Purple for primary text
const ACCENT_PRIMARY_BG = "bg-[#E033FF]"; // Electric Magenta/Purple for buttons
const ACCENT_SECONDARY_COLOR = "text-[#33FFB0]"; // Neon Green for borders/highlights
const NAME = "KENNETH JOHN MINGUITO";

// --- SKILLS DATA ---
const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React / Next.js", icon: "⚛️" },
      { name: "TypeScript / JavaScript", icon: "ʦ" },
      { name: "Tailwind CSS / SCSS", icon: "🌬️" },
      { name: "Responsive Design", icon: "📱" },
      { name: "State Management (Context/Zustand)", icon: "🔄" },
    ],
  },
  {
    title: "Backend & Database",
    skills: [
      { name: "Node.js / Express", icon: "🟢" },
      { name: "REST APIs / GraphQL", icon: "🔗" },
      { name: "MongoDB / PostgreSQL", icon: "🍃" },
      { name: "Firebase / Firestore", icon: "🔥" },
    ],
  },
  {
    title: "Tools & Workflow",
    skills: [
      { name: "Git & GitHub", icon: "🐙" },
      { name: "VS Code", icon: "💻" },
      { name: "Agile/Scrum", icon: "🎯" },
      { name: "Docker (Basic)", icon: "🐳" },
    ],
  },
];


// Custom Link component to replace Next's Link
const CustomLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }> = ({ children, href, className, ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

// Custom Image component with error handling
const CustomImage: React.FC<{ src: string, alt: string, fill?: boolean, objectFit?: string, priority?: boolean, className?: string }> = ({ src, alt, fill, objectFit, className }) => {
    // Placeholder matches the new theme
    const placeholder = "https://placehold.co/400x300/0F0A18/E033FF?text=PROJECT+DATA+MISSING";
    const [imgSrc, setImgSrc] = useState(src);

    // Handles broken image links by switching to a placeholder
    const handleError = () => {
        // Only set the placeholder if the error is on the original image source
        if (imgSrc !== placeholder) { 
            setImgSrc(placeholder);
        }
    };

    if (fill) {
        return (
            <img 
                src={imgSrc}
                alt={alt} 
                className={`absolute inset-0 w-full h-full ${className}`}
                style={{ objectFit: objectFit as any || 'cover' }}
                onError={handleError}
            />
        );
    }
    return <img src={imgSrc} alt={alt} className={className} onError={handleError} />;
};


export default function App(): React.JSX.Element { 
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "FCFS Scheduler Simulator",
      description:
        "A simulator for visualizing First-Come, First-Served scheduling.",
      link: "/projects/fcfs",
      image: "/minguito.jpeg.jpg",
      openInNewTab: true,
    },
    {
      id: 2,
      title: "E-Commerce Shop",
      description:
        "Simple e-commerce mock-up with product browsing and checkout.",
      link: "https://jake-finalproject.vercel.app/",
      image: "/projects/ecommerce.png",
      openInNewTab: true,
    },
    {
      id: 3,
      title: "Digital Graphics App UI",
      description:
        "UI/UX design for a mobile digital graphics editing application.",
      link: "#",
      image: "/placeholder-project-3.jpg",
      openInNewTab: false,
    },
    {
      id: 4,
      title: "Simple Blogging Platform",
      description:
        "A full-stack blogging site with CRUD features.",
      link: "#",
      image: "/placeholder-project-4.jpg",
      openInNewTab: false,
    },
  ];

  const heroImage = "/minguito.jpeg.jpg";

  // State for current year to prevent potential hydration mismatch 
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Ensures the date is set client-side after mounting for consistency
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Simple form submission handler (prevent default)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send data to a backend here.
    console.log("Contact form submitted.");
    // Display a success message or clear the form
  };


  return (
    <main className={`min-h-screen text-white font-sans ${BACKGROUND_COLOR}`}>
      
      {/* Navigation - Enhanced with subtle green border */}
      <nav className="flex items-center justify-between py-6 px-4 md:px-16 max-w-7xl mx-auto sticky top-0 z-10 backdrop-blur-sm bg-[#030107]/90 border-b border-[#33FFB0]/20">
        <span className={`${ACCENT_PRIMARY_COLOR} font-extrabold text-2xl tracking-wider uppercase drop-shadow-lg shadow-[#E033FF]`}>
          {NAME}
        </span>

        <div className="flex space-x-8">
          <CustomLink href="#" className="hidden md:block text-sm text-white/80 hover:text-[#E033FF] transition duration-150">
            HOME
          </CustomLink>
          <CustomLink href="#skills" className="hidden md:block text-sm text-white/80 hover:text-[#E033FF] transition duration-150">
            SKILLS
          </CustomLink>
          <CustomLink href="#portfolio" className="hidden md:block text-sm text-white/80 hover:text-[#E033FF] transition duration-150">
            PROJECT
          </CustomLink>
          <CustomLink href="#contact" className="hidden md:block text-sm text-white/80 hover:text-[#E033FF] transition duration-150">
            CONTACT
          </CustomLink>
          <CustomLink href="#" className="hidden md:block text-sm hover:text-white">
            <span className="px-4 py-2 border border-[#E033FF] rounded-full text-[#E033FF] hover:bg-[#E033FF] hover:text-black transition">My Journey</span>
          </CustomLink>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-16">

        {/* Hero Section */}
        <section className="py-10 md:py-20 flex flex-col md:flex-row justify-between relative">
          
          {/* Profile Card */}
          <div className="md:w-1/3 mb-10 flex justify-center md:justify-start">
            <div className={`w-full max-w-xs ${CARD_BG_COLOR} p-6 rounded-xl border border-[#33FFB0]/30 shadow-2xl shadow-[#E033FF]/10`}>
              
              {/* Profile Image */}
              <div className="relative w-28 h-28 mx-auto mb-4 border-4 border-[#E033FF] rounded-full overflow-hidden shadow-lg shadow-[#E033FF]/50">
                <CustomImage src={heroImage} alt="Profile Image" fill objectFit="cover" priority />
              </div>

              {/* Stats */}
              <div className="flex justify-around text-center mb-6">
                <div>
                  <p className={`text-xl font-bold ${ACCENT_SECONDARY_COLOR}`}>19</p>
                  <p className="text-xs text-white/50">Postingan</p>
                </div>
                <div>
                  <p className={`text-xl font-bold ${ACCENT_SECONDARY_COLOR}`}>2,232</p>
                  <p className="text-xs text-white/50">Kenneth</p>
                </div>
                <div>
                  <p className={`text-xl font-bold ${ACCENT_SECONDARY_COLOR}`}>733</p>
                  <p className="text-xs text-white/50">Minguito</p>
                </div>
              </div>

              {/* Info */}
              <div className="text-sm space-y-2">
                <p className={`font-semibold ${ACCENT_PRIMARY_COLOR}`}> SIMPLE STUDENT WHO WANTS TO BE A DEVELOPER EVENTHOUGH ITS HARD </p>
                <p className="text-white/70">
                  <span className={ACCENT_SECONDARY_COLOR}>email: minguitokennethjohn@gmail.com</span>
                </p>
                <p className="text-white/70 text-xs">Name: Kenneth John C. Minguito</p>
                <p className="text-white/70 text-xs">Age: 20</p>
                <p className="text-white/70 text-xs">📍 San Miguel Cordova, Cebu</p>
              </div>

              <div className="mt-6">
                <CustomLink
                  href="#portfolio"
                  className={`block text-center font-bold px-4 py-2 ${ACCENT_PRIMARY_BG} text-black rounded-md shadow-lg shadow-[#E033FF]/50 hover:shadow-xl transition`}
                >
                  ACCESS PORTFOLIO
                </CustomLink>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="md:w-2/3 md:pl-20">
            <h1 className="text-7xl md:text-8xl font-black uppercase leading-tight">
              <span className={`${ACCENT_PRIMARY_COLOR} drop-shadow-lg shadow-[#E033FF]/50`}>HI its me !</span>
              <br />
              WEB DEVELOPER
            </h1>

            <p className="text-lg text-white/70 mb-8 max-w-xl">
              I'm Kenneth Minguito, a Web Developer focusing on fast, scalable,
              and responsive front-end applications, specializing in the modern JS ecosystem.
            </p>

            <div className="flex space-x-4">
              <CustomLink
                href="/kenneth-minguito-resume.pdf"
                download
                className={`px-6 py-3 rounded-full ${ACCENT_PRIMARY_BG} text-black font-semibold shadow-lg shadow-[#E033FF]/50 hover:shadow-xl transition`}
              >
                Get RESUME !!
              </CustomLink>
              <CustomLink
                href="#contact"
                className={`px-6 py-3 rounded-full border border-[#33FFB0] text-[#33FFB0] font-semibold hover:bg-[#33FFB0]/20 transition`}
              >
                Hire Me !!
              </CustomLink>
            </div>
          </div>
        </section>

        <hr className="border-[#E033FF]/10 my-16" />

        {/* --- SKILLS SECTION --- */}
        <section id="skills" className="my-16">
          <div className="mb-12 text-center">
            <p className={`text-sm text-white/70 ${ACCENT_SECONDARY_COLOR}`}> MODULES LOADED </p>
            <h3 className="text-4xl font-extrabold mt-1 text-white"> SKILLS </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {skillsData.map((category, index) => (
              <div 
                key={index} 
                className={`${CARD_BG_COLOR} p-6 rounded-xl border border-[#33FFB0]/10 transition hover:border-[#E033FF] shadow-xl shadow-[#000000]`}
              >
                <h4 className={`text-xl font-bold mb-6 ${ACCENT_PRIMARY_COLOR} drop-shadow shadow-[#E033FF]`}>
                  {category.title}
                </h4>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center space-x-3 text-white border-b border-white/5 pb-2">
                      {/* Using the secondary neon color for the icons */}
                      <span className={`text-2xl ${ACCENT_SECONDARY_COLOR} font-mono`}>{skill.icon}</span>
                      <p className="font-medium">{skill.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <hr className="border-[#E033FF]/10 my-16" />

        {/* Portfolio Section */}
        <section id="portfolio" className="my-16">
          <div className="mb-12">
            <p className={`text-sm text-white/70 ${ACCENT_PRIMARY_COLOR}`}>// DEPLOYED ARTIFACTS // </p>
            <h3 className="text-4xl font-extrabold">Work Expertise</h3>
          </div>

          {/* Project Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolioItems.map((project) => (
              <CustomLink
                key={project.id}
                href={project.link}
                target={project.openInNewTab ? "_blank" : "_self"}
                className={`group relative aspect-square rounded-lg overflow-hidden transition duration-300 hover:scale-[1.03] shadow-lg hover:shadow-2xl hover:shadow-[#33FFB0]/20`}
              >
                <CustomImage 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  objectFit="cover" 
                  className="opacity-50 group-hover:opacity-100 transition duration-500" 
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col justify-end border-2 border-transparent group-hover:border-[#E033FF] transition duration-300">
                  <h4 className="text-lg font-bold text-[#33FFB0] drop-shadow-md">{project.title}</h4>
                  <p className="text-xs text-white/60">
                    {project.description.substring(0, 50)}...
                  </p>
                </div>
              </CustomLink>
            ))}
          </div>
        </section>

        <hr className="border-[#E033FF]/10 my-16" />

        {/* Contact Form */}
        <section id="contact" className="my-16 p-8 md:p-12 border-4 border-[#E033FF]/50 rounded-lg bg-black/30 shadow-2xl shadow-[#E033FF]/30">
          <h3 className={`text-5xl font-extrabold mb-8 text-center ${ACCENT_PRIMARY_COLOR} drop-shadow-md`}> CONNECT TO NETWORK </h3>

          <form className="max-w-xl mx-auto space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="ENTER_EMAIL_ADDRESS"
              required
              className="w-full p-4 bg-[#0A0A15] border-2 border-[#33FFB0]/50 focus:border-[#E033FF] rounded-md outline-none transition duration-200 text-[#33FFB0] placeholder-white/50 font-mono"
            />
            <textarea
              rows={5}
              placeholder="TRANSMIT_MESSAGE"
              required
              className="w-full p-4 bg-[#0A0A15] border-2 border-[#33FFB0]/50 focus:border-[#E033FF] rounded-md outline-none transition duration-200 resize-none text-[#33FFB0] placeholder-white/50 font-mono"
            ></textarea>

            <button type="submit" className={`w-full ${ACCENT_PRIMARY_BG} text-black font-bold py-3 rounded-md hover:opacity-80 transition duration-200 uppercase shadow-lg shadow-[#E033FF]/50`}>
              STAY CONNECTED !!! 
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#33FFB0]/10 py-6 text-center text-white/50 text-sm">
        <p>© {currentYear} {NAME}.  System Status: Online  All rights reserved.</p>
      </footer>
    </main>
  );
}