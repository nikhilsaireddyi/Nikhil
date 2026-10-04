<div align="center">

# ⚡ Nikhil Sai Reddy — Interactive Portfolio
### *Where Artificial Intelligence Meets Immersive Web Experience*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_to_Visit-00F0FF?style=for-the-badge&logo=vercel&logoColor=black)](https://nikhil-portfolio-vibex1.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/📦_GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nikhilsaireddyi/Nikhil)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Sound-FF8F00?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Vercel Status](https://img.shields.io/badge/Deployment-Online_100%25-brightgreen?style=flat-square&logo=vercel)](https://nikhil-portfolio-vibex1.vercel.app)

<br/>

> **"A digital playground built to demonstrate modern web engineering, real-time AI simulations, and fluid cyberpunk aesthetics."**

---

</div>

## 💡 What is this project? (In Simple Words)

Most portfolios are just static resumes on a screen. **This project is different.**

It is an **interactive digital showcase** created by **Nikhil Sai Reddy** (AI/ML Developer & Frontend Engineer). Rather than just listing skills in bullet points, this site **lets visitors interact directly** with real-time neural network simulations, dynamic sound synthesis, customizable visual themes, and smooth physics.

---

## 🗺️ Visual Flowchart: How the Portfolio Works

Here is a bird's-eye view of how a visitor moves through the portfolio:

```mermaid
flowchart TD
    Start(["👋 Visitor Enters Portfolio"]) --> Hero["🌌 1. Hero Experience\n• Kinetic Typography\n• Interactive Geometric Starfield\n• Reactive Atmosphere"]

    Hero --> ThemeCheck{"🎨 Customize Vibe?"}
    ThemeCheck -- "Yes" --> ThemeEngine["Switch Theme:\nLime | Cyberpunk | Solar | Violet\n(Canvas + UI automatically adapt)"]
    ThemeCheck -- "Continue" --> AboutSec["👤 2. About & Philosophy\n• AI/ML & Engineering Vision\n• Education at Nxt Wave (CSE AI/ML)"]

    ThemeEngine --> AboutSec

    AboutSec --> LabSec["🧪 3. The Interactive AI Lab\n(Hands-on Simulation Zone)"]

    subgraph Interactive_AI_Lab ["Interactive AI Playground"]
        LabSec --> Classifier["✏️ Draw a Digit (0-9)\nReal-time Neural Classification"]
        LabSec --> ThreeD["🌐 3D Neural Network\nDrag to Rotate Layers & Nodes"]
        LabSec --> SoundSynth["🔊 Procedural Web Audio\nSynaptic Pulses & Overclocking"]
    end

    Interactive_AI_Lab --> ProjectsSec["🎮 4. Featured Creations\n• Ganesh: The Quest (2.5D Canvas Game)"]
    ProjectsSec --> ToolkitSec["🛠️ 5. Technical Toolkit\n• Next.js 16 • React 19 • TypeScript\n• AI Foundations • Kinetic Physics"]
    ToolkitSec --> ContactSec["📬 6. Contact & Socials\n• Email • LinkedIn • GitHub • Instagram"]
    ContactSec --> End(["🤝 Let's Build Together!"])

    style Start fill:#00F0FF,stroke:#0052A3,stroke-width:2px,color:#000
    style Interactive_AI_Lab fill:#111526,stroke:#7928CA,stroke-width:2px,color:#FFF
    style End fill:#C7FF4A,stroke:#38B2AC,stroke-width:2px,color:#000
```

---

## 🧠 Interactive AI Lab: How the Digit Classifier Works

Inside the portfolio's **Lab section**, anyone can test an AI model directly inside the browser. No servers, no delays:

```mermaid
flowchart LR
    A["✍️ Draw Number\non Canvas"] --> B["📐 Preprocess Input\n(Rescale & Normalize)"]
    B --> C["⚡ Neural Forward Pass\n(Input ➔ Hidden ➔ Output)"]
    C --> D["📊 Live Confidence Bar\n(0% to 100%)"]
    C --> E["🔮 Hidden Layer Activations\n(Visualized Instantly)"]
    C --> F["🔊 Procedural Sound\n(Synaptic Audio Pulse)"]

    style A fill:#FF8F00,color:#000,stroke:#FFF
    style C fill:#00F0FF,color:#000,stroke:#FFF
    style D fill:#C7FF4A,color:#000,stroke:#FFF
    style E fill:#7928CA,color:#FFF,stroke:#FFF
    style F fill:#E11D48,color:#FFF,stroke:#FFF
```

---

## ⚙️ Under-the-Hood: System Architecture

How all the technologies connect together seamlessly:

```mermaid
flowchart TB
    subgraph Browser ["🖥️ Client Browser"]
        direction TB

        subgraph CoreApp ["Next.js 16 + React 19 App"]
            Nav["Navigation & Theme HUD"]
            Sections["Hero | About | Lab | Projects | Toolkit | Contact"]
        end

        subgraph EngineLayer ["Core Feature Engines"]
            Lenis["⚡ Lenis Engine\n(Inertia 60fps Smooth Scroll)"]
            ThemeStore["🎨 Theme Engine\n(Lime, Cyberpunk, Solar, Violet)"]
            AudioAPI["🔊 Web Audio API Engine\n(Zero-file sound synthesis)"]
            CanvasAtmosphere["🌌 HTML5 Canvas Engine\n(Geometric physics & particle fields)"]
        end

        Nav -.-> ThemeStore
        ThemeStore ==> CanvasAtmosphere
        ThemeStore ==> Sections
        Sections --> AudioAPI
        Sections --> Lenis
    end

    subgraph Hosting ["☁️ Cloud Edge Delivery"]
        Vercel["▲ Vercel Edge Network\n(Zero Latency Global CDN)"]
    end

    Hosting ===> Browser

    style Browser fill:#0D1117,stroke:#30363D,stroke-width:2px,color:#FFF
    style EngineLayer fill:#161B22,stroke:#00F0FF,stroke-width:1.5px,color:#FFF
    style Hosting fill:#000,stroke:#FFF,stroke-width:2px,color:#FFF
```

---

## 🌟 Key Sections Explained

| # | Section | What Visitors See & Experience |
| :-: | :--- | :--- |
| **1** | **Hero & Cyber Sky** | A dynamic animated HUD with role cycling and a particle constellation canvas that responds to theme changes. |
| **2** | **About & Vision** | Nikhil's journey as an aspiring AI Engineer from **Vizag, India**, pursuing CSE (AI/ML) at **Nxt Wave**. |
| **3** | **Interactive Lab** | A hands-on science room with a **Neural Digit Classifier**, **3D Network visualizer**, and **hardware overclock sound engine**. |
| **4** | **Featured Projects** | Showcases **Ganesh: The Quest** — an original 2.5D festival adventure game with custom physics, procedural music, and parallax art. |
| **5** | **Toolkit & Skills** | Organized breakdown of frontend technologies, kinetic engines, and artificial intelligence focus areas. |
| **6** | **Contact Terminal** | Direct links to collaborate via email, LinkedIn, GitHub, and Instagram. |

---

## 🎨 Reactive Theme Engine

Visitors can toggle between **4 custom aesthetics** with one click in the navbar. Every single element adapts dynamically:

```
[ Lime Spark ]      ➔ High-energy Neon Lime & Deep Carbon (#C7FF4A)
[ Cyberpunk 2077 ]  ➔ Electric Cyan & Synthwave Magenta (#00F0FF)
[ Solar Flare ]     ➔ Solar Amber & Warm Ember Glow (#FF8F00)
[ Deep Violet ]     ➔ Midnight Violet & Dimensional Purple (#7928CA)
```

---

## 🚀 Quick Start (Run Locally on Your Machine)

Want to explore the code or run this on your computer? Follow these 4 easy steps:

### 1. Clone the project
```bash
git clone https://github.com/nikhilsaireddyi/Nikhil.git
cd Nikhil
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open in your browser
Navigate to **`http://localhost:3000`** to experience the portfolio locally!

---

## 📁 Repository Directory Map

```
nikhil-portfolio/
│
├── 📂 src/
│   ├── 📂 app/              # Next.js 16 App Router (pages & global layout)
│   ├── 📂 components/       # All modular UI components
│   │   ├── 📂 layout/       # Navigation bar, Footer, Theme Switcher
│   │   ├── 📂 motion/       # HTML5 Canvas background & smooth scrolling
│   │   ├── 📂 sections/     # Hero, About, Lab, Projects, Toolkit, Contact
│   │   └── 📂 ui/           # Neural Classifier, 3D Network, Buttons
│   ├── 📂 data/             # Easily editable data (projects, skills, socials)
│   ├── 📂 hooks/            # Custom hooks (hover states, reduced motion)
│   ├── 📂 lib/              # Procedural Web Audio synthesizer
│   └── 📂 types/            # TypeScript data contracts & interfaces
│
├── 📂 public/               # Images, icons, and static assets
├── 📄 package.json          # Project dependencies & npm scripts
└── 📄 README.md             # You are here!
```

---

## 🌐 Live Deployments

* **Primary Link:** [https://nikhil-portfolio-vibex1.vercel.app](https://nikhil-portfolio-vibex1.vercel.app)
* **CDN Mirror:** [https://nikhil-portfolio-gamma-orcin.vercel.app](https://nikhil-portfolio-gamma-orcin.vercel.app)

---

## 📬 Let's Connect!

<div align="center">

**Nikhil Sai Reddy**  
*AI/ML Developer & Frontend Engineer • Vizag, India*

<br/>

[![Email](https://img.shields.io/badge/Email-nikhilsaireddyi@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nikhilsaireddyi@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Nikhil_Sai_Reddy-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/nikhil-sai-reddy-induri-0ab948432)
[![GitHub](https://img.shields.io/badge/GitHub-nikhilsaireddyi-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nikhilsaireddyi)
[![Instagram](https://img.shields.io/badge/Instagram-@__nikhilsai08__-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_nikhilsai08_)

<br/>

<sub>⭐ If you enjoyed exploring this portfolio, don't forget to star the repository!</sub>

</div>
