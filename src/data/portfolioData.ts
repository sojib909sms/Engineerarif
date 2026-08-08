import { Project, SkillCategory, SoftwareTool, EngineeringService, Testimonial, CareerMilestone, ProjectStat, EngineerInfo } from '../types';

import heroImg from '../assets/images/hero_civil_engineering_1786179548019.jpg';
import profileImg from '../assets/images/civil_engineer_arif_mia_1786184741067.jpg';
import renderBuildingImg from '../assets/images/render_3dsmax_building_1786179580595.jpg';
import sitePhotoImg from '../assets/images/site_construction_photo_1786179599630.jpg';

export const ENGINEER_INFO: EngineerInfo = {
  name: "MD Arif Mia",
  title: "Civil Engineering Designer & Construction Site Engineer | AutoCAD 2D/3D & 3ds Max Specialist",
  roles: [
    "Construction Site Engineer",
    "AutoCAD 2D Designer",
    "AutoCAD 3D Designer",
    "3ds Max Artist",
    "Architectural Visualizer",
    "Civil Engineering Designer",
    "Site Layout & Execution Specialist",
    "3D Modeling Expert",
    "Rendering & Visualization Artist",
    "Structural Drafting Specialist",
    "Construction Working Drawings",
    "Interior & Exterior Visualizer",
    "CAD Draftsman",
    "Field Coordinator",
    "Technical Drawing Specialist",
    "Photography Enthusiast",
    "AI Creative Designer"
  ],
  shortIntro: "I am a Civil Engineering Designer & Site Engineer with 3+ years of practical experience. My highest core expertise is Construction Site Engineering—managing rebar checking, site layout, and structural execution—combined with precision AutoCAD 2D/3D drafting and 3ds Max photorealistic visualization.",
  bioSummary: "I am a dedicated Civil Engineering Designer and Construction Site Engineer with 3+ years of professional experience. My strongest core skill lies in construction site engineering and site execution—managing real-world rebar placement, structural layouts, concrete works, and field measurements—complemented by high-level AutoCAD 2D/3D drafting and 3ds Max 3D visualization.\n\nCurrently pursuing my M.Sc. in Civil Engineering at North South University (NSU), holding a B.Sc. from Uttara University, and a Diploma from Rangpur City Institute of Technology (RCIT), I combine strong academic credentials with hands-on field expertise to deliver constructible, cost-effective, and high-precision engineering solutions.",
  email: "arif.mia02@uttarauniversity.edu.bd",
  phone: "01568647919",
  whatsapp: "https://wa.me/8801568647919",
  location: "Dhaka, Bangladesh",
  peLicense: "Verified Civil Engineering Designer",
  social: {
    whatsapp: "https://wa.me/8801568647919",
    facebook: "https://www.facebook.com/share/19C36PH6t2/",
    linkedin: "https://www.linkedin.com/in/engineerarif12",
    twitter: "https://x.com/engineerarif12",
    instagram: "https://www.instagram.com/engineerarif12"
  },
  linkedin: "https://www.linkedin.com/in/engineerarif12",
  facebook: "https://www.facebook.com/share/19C36PH6t2/",
  twitter: "https://x.com/engineerarif12",
  instagram: "https://www.instagram.com/engineerarif12",
  yearsExperience: 3,
  projectsCompleted: 250,
  happyClients: 180,
  designAccuracy: "100%",
  clientSatisfaction: "99%",
  profileImage: profileImg,
  heroBgImage: heroImg,
  education: [
    {
      degree: "M.Sc. in Civil Engineering",
      institution: "North South University (NSU)",
      year: "Enrolled / In Progress",
      honors: "Advanced Infrastructure & Structural Engineering"
    },
    {
      degree: "B.Sc. in Civil Engineering",
      institution: "Uttara University",
      year: "Graduated",
      honors: "Structural Engineering & Construction Technology"
    },
    {
      degree: "Diploma in Civil Engineering",
      institution: "Rangpur City Institute of Technology (RCIT)",
      year: "Graduated",
      honors: "Surveying, CAD Drafting & Construction Engineering"
    }
  ],
  certifications: [
    "Autodesk Certified Professional: AutoCAD 2D & 3D",
    "3ds Max & Chaos V-Ray Architectural Visualization Specialist",
    "Structural Working Drawing & Rebar Detailing Expert",
    "Construction Site Supervision & Field Execution Safety"
  ],
  designSoftware: [
    "AutoCAD",
    "Autodesk 3ds Max",
    "Adobe Photoshop",
    "Microsoft PowerPoint",
    "Microsoft Word",
    "Microsoft Excel",
    "Canva",
    "Google AI Studio"
  ]
};

export const PROJECTS_DATA: Project[] = [
  // --- AutoCAD 2D Projects ---
  {
    id: "cad-2d-01",
    title: "Residential Floor Plans & Layout Drawing Set",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Complete multi-unit duplex & villa residential floor plan blueprint",
    description: "Accurate 2D AutoCAD architectural floor plan featuring dimensioned room layouts, furniture placement, door/window schedules, wall thicknesses, and circulation paths tailored for modern residential living.",
    client: "Green Valley Development Ltd.",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80"
    ],
    software: ["AutoCAD 2024", "Adobe Photoshop"],
    specifications: {
      "Project Type": "Residential Floor Plan",
      "Total Area": "3,200 sq. ft.",
      "Units": "4 Bedrooms, 4 Baths, Living, Dining, Family Lounge",
      "Drawing Scale": "1:50 Metric"
    },
    layers: [
      { name: "A-WALL (External & Interior Partition Walls)", color: "#FF0000", visible: true },
      { name: "A-DOOR (Door Swings & Window Openings)", color: "#0000FF", visible: true },
      { name: "A-FURN (Furniture & Fixtures Layout)", color: "#00FF00", visible: true },
      { name: "A-DIM (Precision Dimensions & Grids)", color: "#FFFF00", visible: true },
      { name: "A-ANNO (Room Labels & Area Schedules)", color: "#FFFFFF", visible: true }
    ],
    cadDetails: {
      scale: "1:50 Metric",
      paperSize: "ARCH D (24\" x 36\")",
      codeCompliance: "BNBC / National Building Code",
      totalAreaSqFt: 3200,
      drawingNumber: "ARCH-2D-RES-01"
    },
    tags: ["Residential Floor Plans", "AutoCAD 2D", "Architectural Plan", "Dimensioned Layout"],
    featured: true
  },
  {
    id: "cad-2d-02",
    title: "Commercial Multi-Story Floor Plans & Space Planning",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "High-density commercial office building floor layout & emergency egress",
    description: "Comprehensive 2D AutoCAD commercial floor plan package including open office workspaces, executive suites, conference rooms, service cores, stairwells, and municipal compliance layouts.",
    client: "Apex Commercial Towers",
    year: "2024",
    location: "Gulshan, Dhaka",
    mainImage: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024", "MS Excel"],
    specifications: {
      "Project Type": "Commercial Floor Plan",
      "Floor Area": "12,500 sq. ft. per floor",
      "Occupancy": "Up to 180 Workspace Desks",
      "Egress": "Dual Fire Exit Stairs & Elevator Core"
    },
    cadDetails: {
      scale: "1:100 Metric",
      paperSize: "ANSI D (22\" x 34\")",
      codeCompliance: "Commercial Fire & Safety Standards",
      totalAreaSqFt: 12500,
      drawingNumber: "ARCH-2D-COM-02"
    },
    tags: ["Commercial Floor Plans", "AutoCAD 2D", "Space Planning", "Office Layout"]
  },
  {
    id: "cad-2d-03",
    title: "Front & Side Architectural Elevation Drawings",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Precision exterior facade elevation drawings with surface materials & heights",
    description: "Detailed 2D CAD elevation drawings illustrating building height levels, window mullions, exterior plaster finish textures, roof parapet caps, and floor-to-floor height markers.",
    client: "Urban Heights Builders",
    year: "2024",
    location: "Uttara, Dhaka",
    mainImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Elevation Drawings",
      "Building Height": "65 Feet (5-Story)",
      "Facade Finish": "Glass Curtain Wall & Textured Stone Panels"
    },
    tags: ["Elevation Drawings", "AutoCAD 2D", "Exterior Facade", "Building Elevation"]
  },
  {
    id: "cad-2d-04",
    title: "Building Longitudinal & Cross Section Drawings",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Slab-to-slab height cuts, staircase sections, and wall material details",
    description: "Technical section drawings showcasing internal floor levels, foundation depth, roof slope waterproofing details, staircase headroom, and structural slab cutaways.",
    client: "Horizon Living Communities",
    year: "2023",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Section Drawings",
      "Section Type": "Transverse & Longitudinal Cuts",
      "Detail Scale": "1:20 & 1:50"
    },
    tags: ["Section Drawings", "AutoCAD 2D", "Building Cutaway", "Slab Details"]
  },
  {
    id: "cad-2d-05",
    title: "Construction Working Drawing Permit Set",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Execution-ready full architectural working drawing documentation",
    description: "Complete working drawing set containing door/window opening schedules, brickwork layout dimensions, wall chasing details, balcony railings, and toilet drop slab details.",
    client: "Propertix Engineering Ltd.",
    year: "2024",
    location: "Chittagong, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024", "Adobe PDF"],
    specifications: {
      "Project Type": "Working Drawings",
      "Sheet Count": "18 Detailed Drawing Sheets",
      "Format": "A1 & A3 Construction Print Set"
    },
    tags: ["Working Drawings", "Construction Drawings", "Permit Package", "AutoCAD 2D"]
  },
  {
    id: "cad-2d-06",
    title: "Structural Beam, Column & Slab Reinforcement Drawings",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "RCC structural layout, column schedule, and beam rebar placement",
    description: "Detailed structural 2D CAD drawings including column placement grids, beam cross-section reinforcement hooks, slab main & extra top rebar schedules, and lap length notes.",
    client: "Eastern Structural Engineers",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Structural Drawings",
      "Concrete Grade": "25 MPa (3600 psi)",
      "Rebar Grade": "500W High-Yield Steel"
    },
    tags: ["Structural Drawings", "AutoCAD 2D", "Rebar Detailing", "RCC Beam & Column"]
  },
  {
    id: "cad-2d-07",
    title: "Isolated & Mat Foundation Layout Drawing",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Geotechnical footing dimensions, pile cap details, and tie beam placement",
    description: "Foundation structural plan detailing footing sizes, excavation depth lines, rebar mesh arrangements, short & long column starter bars, and grade beam connections.",
    client: "Metro Civil Infrastructure",
    year: "2023",
    location: "Sylhet, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Foundation Layout",
      "Foundation Type": "Combined Footings & Grade Beams",
      "Depth": "6.5 Feet Excavation Depth"
    },
    tags: ["Foundation Layout", "Structural Engineering", "Footing Details", "AutoCAD 2D"]
  },
  {
    id: "cad-2d-08",
    title: "Dog-Legged RCC Staircase Details & Reinforcement",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Riser & tread geometry, waist slab thickness, and landing rebar layout",
    description: "Full architectural and structural stair detail CAD sheet showing tread/riser ratios, waist slab steel bars, landing beam support, and handrail mounting points.",
    client: "Apex Residential Developers",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Stair Details",
      "Stair Type": "Two-Flight RCC Dog-Legged Stair",
      "Riser/Tread": "6\" Riser / 10\" Tread"
    },
    tags: ["Stair Details", "AutoCAD 2D", "Staircase Drawing", "Rebar Details"]
  },
  {
    id: "cad-2d-09",
    title: "Roof Slope, Drainage & Truss Framing Layout",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Steel roof truss connections, slope arrows, water outlets, and parapet details",
    description: "Roof layout CAD drawing detailing rainwater slope directions, drain pipe positions, roof slab insulation, overhead water tank tower location, and steel truss framing.",
    client: "Industrial Park Estate",
    year: "2023",
    location: "Gazipur, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Roof Layout",
      "Roof Style": "Flat RCC Slab with Slope Concrete & Drainage Pipes"
    },
    tags: ["Roof Layout", "AutoCAD 2D", "Drainage Plan", "Roof Truss"]
  },
  {
    id: "cad-2d-10",
    title: "Sanitary & Water Supply Plumbing Drawings",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Piping layout, waste stack pipes, septic tank & overhead tank line diagram",
    description: "Comprehensive 2D plumbing schematic detailing cold/hot water pipe routes, soil & waste stack lines, inspection pit placement, and septic tank internal chamber dimensions.",
    client: "Mirpur Housing Society",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Plumbing Drawings",
      "System": "Dual Pipe Water Supply & Wastewater Drainage"
    },
    tags: ["Plumbing Drawings", "AutoCAD 2D", "Sanitary Layout", "Water Supply"]
  },
  {
    id: "cad-2d-11",
    title: "Electrical Lighting & Power Outlet Layout",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Switchboard locations, conduit pathways, DB box & light fixture distribution",
    description: "Electrical engineering 2D CAD layout indicating light switch locations, socket positions, sub-distribution board connection diagrams, and ceiling fan fixture spacing.",
    client: "Royal Residency Project",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Electrical Layout",
      "Wiring": "Concealed PVC Conduit Wiring System"
    },
    tags: ["Electrical Layout", "AutoCAD 2D", "Conduit Layout", "Lighting Plan"]
  },
  {
    id: "cad-2d-12",
    title: "Master Site Plan & Boundary Layout Drawing",
    category: "autocad-2d",
    categoryLabel: "AutoCAD 2D Projects",
    subtitle: "Plot boundaries, setback margins, approach roads, and landscaping zones",
    description: "Master site planning CAD drawing detailing plot offsets, setback distance calculations as per local building codes, main entrance gate, driveway radius, and green zones.",
    client: "National Housing Authority",
    year: "2024",
    location: "Dhanmondi, Dhaka",
    mainImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 2024"],
    specifications: {
      "Project Type": "Site Plan",
      "Plot Area": "10 Kaltha (7,200 sq. ft.)",
      "FAR": "Floor Area Ratio Compliance Map"
    },
    tags: ["Site Plan", "AutoCAD 2D", "Master Planning", "Land Boundary"]
  },

  // --- AutoCAD 3D Projects ---
  {
    id: "cad-3d-01",
    title: "Residential House 3D CAD Massing & Solid Model",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "3D solid building geometry, balcony projections, and roof overhangs",
    description: "Fully articulated 3D AutoCAD solid model for a modern 3-story family residence. Created directly from 2D CAD floor plans to verify spatial proportions and structural massing.",
    client: "Private Residence Client",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Residential House Model",
      "Building Scale": "3-Story Duplex Villa",
      "Format": "3D Solid .DWG"
    },
    cadDetails: {
      scale: "1:1 Full 3D Solid Geometry",
      paperSize: "3D CAD Model Space",
      codeCompliance: "Residential Zoning Approved",
      totalAreaSqFt: 4500,
      drawingNumber: "CAD3D-RES-01"
    },
    tags: ["Residential House Model", "AutoCAD 3D", "3D Building", "CAD Massing"],
    featured: true
  },
  {
    id: "cad-3d-02",
    title: "Commercial Glass Plaza & Retail Tower 3D Assembly",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "Multi-level commercial atrium, glass curtain wall & structural frame",
    description: "Detailed 3D AutoCAD structural model of a commercial shopping mall and corporate office tower showcasing glass facades, escalator shafts, and entrance canopy frames.",
    client: "City Center Commercial Group",
    year: "2024",
    location: "Banani, Dhaka",
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Commercial Building Model",
      "Floors": "8 Commercial Floors + Basement Parking"
    },
    tags: ["Commercial Building Model", "AutoCAD 3D", "3D Structure", "Glass Facade"]
  },
  {
    id: "cad-3d-03",
    title: "Luxury Villa Design & 3D Spatial Geometry",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "Contemporary villa architectural 3D CAD modeling with courtyard feature",
    description: "3D AutoCAD architectural villa model featuring double-height living room spaces, cantilevered patio slabs, poolside pergola structures, and decorative window louvers.",
    client: "Serene Living Developers",
    year: "2024",
    location: "Bashundhara R/A, Dhaka",
    mainImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Villa Design",
      "Plot Footprint": "5,000 sq. ft."
    },
    tags: ["Villa Design", "AutoCAD 3D", "3D CAD Architecture", "Modern Villa"]
  },
  {
    id: "cad-3d-04",
    title: "Modern Duplex House 3D Exterior CAD Structure",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "Two-story luxury duplex 3D CAD framework with roof garden terrace",
    description: "3D CAD model showcasing the structural massing of a duplex house, including open-air terrace parapets, carved entryway columns, and window shade projections.",
    client: "Prime Housing Solutions",
    year: "2023",
    location: "Chittagong, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Duplex House",
      "Building Style": "Contemporary Flat Roof Duplex"
    },
    tags: ["Duplex House", "AutoCAD 3D", "3D Residence", "Duplex Model"]
  },
  {
    id: "cad-3d-05",
    title: "Multi-Family Apartment Building 3D CAD Model",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "6-Story residential apartment block 3D solid geometry & balcony grids",
    description: "Detailed 3D CAD model for a multi-family apartment complex, incorporating repeating balcony units, stair core volume, and roof-top community shade canopy.",
    client: "Standard Builders Ltd.",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Apartment Building",
      "Units": "12 Residential Apartments"
    },
    tags: ["Apartment Building", "AutoCAD 3D", "Multi-Family Housing", "3D Building"]
  },
  {
    id: "cad-3d-06",
    title: "Interior Spatial Partition & Staircase 3D CAD Model",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "3D interior partition walls, staircase steps, and ceiling drop levels",
    description: "Precise 3D AutoCAD interior modeling detailing room division walls, staircase steps, door openings, and dropped gypsum ceiling levels prior to 3ds Max rendering.",
    client: "Design Concepts Studio",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Interior Modeling",
      "Focus": "Spatial Interior Volume & Stair Geometry"
    },
    tags: ["Interior Modeling", "AutoCAD 3D", "Interior Geometry", "CAD Stairs"]
  },
  {
    id: "cad-3d-07",
    title: "Exterior Building Envelope & Facade 3D Solid Model",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "3D facade panels, louvers, window frames, and exterior cladding",
    description: "Complex 3D AutoCAD exterior skin model focused on architectural cladding panels, sun louvers, glass railing posts, and exterior decorative lighting fixtures.",
    client: "Apex Architecture Firm",
    year: "2023",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Exterior Modeling",
      "Element": "Exterior Architectural Skin"
    },
    tags: ["Exterior Modeling", "AutoCAD 3D", "Building Facade", "Facade Geometry"]
  },
  {
    id: "cad-3d-08",
    title: "3D Landscape Contours, Paving & Hardscape Layout",
    category: "autocad-3d",
    categoryLabel: "AutoCAD 3D Projects",
    subtitle: "3D garden terracing, walkway boundary steps, and water feature geometry",
    description: "3D landscape modeling detailing site elevation steps, retaining wall planters, swimming pool coping edges, and outdoor seating hardscapes.",
    client: "Resort & Villa Estates",
    year: "2024",
    location: "Cox's Bazar, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    software: ["AutoCAD 3D 2024"],
    specifications: {
      "Project Type": "Landscape Modeling",
      "Area": "15,000 sq. ft. Site Hardscape"
    },
    tags: ["Landscape Modeling", "AutoCAD 3D", "Site Hardscape", "3D Landscape"]
  },

  // --- 3ds Max Visualization ---
  {
    id: "3dsmax-01",
    title: "Commercial High-Rise Architectural Exterior Render",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "8K photorealistic exterior architectural render with V-Ray sun & HDRI sky",
    description: "High-end photorealistic 3D architectural exterior rendering created using Autodesk 3ds Max and Chaos V-Ray. Features reflective curtain wall glass, PBR concrete and metallic finishes, volumetric sky lighting, and realistic urban surroundings.",
    client: "Horizon Real Estate Development",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: renderBuildingImg,
    clayRenderImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      renderBuildingImg,
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    software: ["3ds Max 2024", "Chaos V-Ray 6", "Adobe Photoshop CC"],
    specifications: {
      "Render Engine": "Chaos V-Ray 6 GPU",
      "Resolution": "7680 x 4320 (8K Ultra HD)",
      "Lighting": "HDRI Sky + Direct Sun System",
      "Materials": "PBR Glass, Anodized Steel, Brushed Concrete"
    },
    tags: ["Exterior Rendering", "3ds Max Visualization", "V-Ray", "Photorealistic", "Architectural Render"],
    featured: true
  },
  {
    id: "3dsmax-02",
    title: "Luxury Villa Interior Living Space 3D Render",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Photorealistic interior lighting, warm wood textures, and custom furniture",
    description: "Full interior 3ds Max architectural render highlighting natural daylighting through double-height windows, warm ambient interior spotlighting, PBR marble floor reflections, and custom furniture models.",
    client: "Solaria Eco Residences",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "Chaos V-Ray / Corona", "Photoshop"],
    specifications: {
      "Render Engine": "Chaos Corona 10",
      "Output Resolution": "6000 x 4000 pixels",
      "Lighting": "Interactive LightMix Daylight"
    },
    tags: ["Interior Rendering", "3ds Max Visualization", "Living Room", "Photorealistic", "Interior Space"]
  },
  {
    id: "3dsmax-03",
    title: "Commercial Building Daytime Architectural Exterior View",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Crisp daytime sunlight render showcasing building materials & landscaping",
    description: "Daytime architectural view rendered in 3ds Max depicting crisp shadows, vibrant blue sky contrast, realistic street greenery, and glass reflections under bright sunlight.",
    client: "Metropolitan Properties",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6", "Photoshop"],
    specifications: {
      "View Angle": "Eye-Level Street Perspective",
      "Lighting": "Clear Blue Day HDRI Sky"
    },
    tags: ["Day View", "3ds Max Visualization", "Exterior Render", "Daylight Render"]
  },
  {
    id: "3dsmax-04",
    title: "Architectural Exterior Night View & Atmospheric Lighting",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Dusk/Night atmosphere with interior warm light glow and outdoor uplights",
    description: "Atmospheric evening/night 3ds Max architectural render illustrating interior warm lighting glowing through windows, exterior wall sconces, landscape spot lights, and night sky contrast.",
    client: "Elite Living Towers",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6", "Photoshop"],
    specifications: {
      "View Angle": "Dusk Twilight Scene",
      "Lighting": "IES Photometric Warm Interior & Landscape Spotlights"
    },
    tags: ["Night View", "3ds Max Visualization", "Dusk Render", "Atmospheric Lighting"]
  },
  {
    id: "3dsmax-05",
    title: "Contemporary Living Room Interior Architectural Visualization",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Modern sofa arrangement, TV wall accent panel, and warm pendant lighting",
    description: "Detailed living room interior 3d visualization featuring wooden wall paneling, modern sectional sofa, concealed LED strip lights, decorative indoor plants, and soft rug textures.",
    client: "Residential Interior Client",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6", "Photoshop"],
    specifications: {
      "Room Type": "Living Room Interior",
      "Style": "Minimalist Contemporary Warm Design"
    },
    tags: ["Living Room", "Interior Rendering", "3ds Max Visualization", "Modern Living"]
  },
  {
    id: "3dsmax-06",
    title: "Master Bedroom Suite 3D Architectural Render",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Upholstered king bed, ambient side lamp illumination, and wardrobe glass doors",
    description: "Serene master bedroom suite visualization depicting soft fabric textures, ambient bedside lamps, tinted glass wardrobe panels, and cozy wooden flooring.",
    client: "Luxury Residence Studio",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6"],
    specifications: {
      "Room Type": "Master Bedroom",
      "Lighting": "Soft Sunset Warm Mood Lighting"
    },
    tags: ["Bedroom", "Interior Rendering", "3ds Max Visualization", "Bedroom Suite"]
  },
  {
    id: "3dsmax-07",
    title: "Modern Modular Kitchen Interior 3D Visualization",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Marble island countertop, seamless cabinet finish, and built-in appliances",
    description: "Sleek kitchen interior render displaying polished quartz countertop reflections, under-cabinet LED strip lights, built-in oven units, and breakfast bar seating.",
    client: "Modern Kitchen Designs",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6"],
    specifications: {
      "Room Type": "Kitchen Interior",
      "Finishes": "PBR Quartz, Matte Acrylic Cabinets"
    },
    tags: ["Kitchen", "Interior Rendering", "3ds Max Visualization", "Modular Kitchen"]
  },
  {
    id: "3dsmax-08",
    title: "Corporate Executive Office Interior 3D Render",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Executive desk, ergonomic seating, glass partitions, and skyline views",
    description: "Professional corporate office interior visualization showcasing a executive desk setup, acoustic wood wall slats, ceiling panel lights, and glass window city views.",
    client: "TechCorp Headquarters",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6"],
    specifications: {
      "Space Type": "Corporate Office Interior",
      "Lighting": "6000K Daylight LED Grid + Exterior Window Light"
    },
    tags: ["Office Interior", "3ds Max Visualization", "Commercial Interior", "Executive Desk"]
  },
  {
    id: "3dsmax-09",
    title: "Commercial Plaza & Retail Complex 3D Exterior Render",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Multi-tenant retail storefronts, pedestrian walkways, and canopy lights",
    description: "Vibrant commercial shopping plaza exterior render featuring retail glass display windows, outdoor seating umbrellas, entrance canopy LED strips, and 3D human entourage.",
    client: "Grand Market Developers",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6", "Forest Pack"],
    specifications: {
      "Project Type": "Commercial Building Render",
      "Scale": "Commercial Shopping Plaza & Arcade"
    },
    tags: ["Commercial Building Render", "3ds Max Visualization", "Retail Facade", "Plaza Render"]
  },
  {
    id: "3dsmax-10",
    title: "3D Architectural Walkthrough Stills & Perspective Camera Angles",
    category: "3dsmax",
    categoryLabel: "3ds Max Visualization",
    subtitle: "Cinematic camera angles for 3D walkthrough video presentation scenes",
    description: "Curated series of architectural camera angles optimized for client walkthrough presentations, showcasing smooth spatial flow from entry foyer to main balcony.",
    client: "Crown Properties Ltd.",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    software: ["3ds Max 2024", "V-Ray 6", "Adobe After Effects"],
    specifications: {
      "Format": "4K Architectural Walkthrough Keyframes",
      "Camera": "Physical Camera with Cinematic Motion Blur"
    },
    tags: ["Walkthrough Images", "3ds Max Visualization", "Architectural Walkthrough", "Cinematic Camera"]
  },

  // --- Photography ---
  {
    id: "photo-01",
    title: "Construction Site Quality Inspection Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "High-resolution on-site field photography of rebar cages & concrete pour",
    description: "Professional field construction photography capturing active beam rebar tying, column starter bar alignments, concrete pump placement, and safety compliance checks.",
    client: "Civil Site Quality Department",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: sitePhotoImg,
    galleryImages: [
      sitePhotoImg,
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
    ],
    software: ["DSLR Camera", "Lightroom Classic"],
    specifications: {
      "Camera Equipment": "Full Frame DSLR + 24-70mm f/2.8 Lens",
      "Purpose": "Construction Quality Audit & Field Documentation"
    },
    tags: ["Construction Site Photography", "Photography", "Field Work", "Site Inspection"],
    featured: true
  },
  {
    id: "photo-02",
    title: "Completed High-Rise Building Architectural Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Professional architectural photography of finished building facades",
    description: "Architectural exterior photography documenting completed commercial and residential structures, capturing glass reflections, geometry lines, and ambient daylight.",
    client: "Architectural Showcase Magazine",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    software: ["DSLR Camera", "Lightroom Classic"],
    specifications: {
      "Genre": "Architectural Facade Photography",
      "Post-Processing": "Perspective Correction & HDR Blending"
    },
    tags: ["Architectural Photography", "Photography", "Building Facade", "Completed Project"]
  },
  {
    id: "photo-03",
    title: "Building Exterior Architectural Perspective Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Low-angle dynamic perspective photo highlighting building verticality",
    description: "Creative architectural photograph capturing dramatic low-angle views of modern glass and concrete building exteriors reaching towards the sky.",
    client: "Design Portfolio Works",
    year: "2023",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    software: ["DSLR Camera", "Lightroom"],
    specifications: {
      "Type": "Exterior Angle Photography",
      "Lens": "16-35mm Ultra-Wide Angle Lens"
    },
    tags: ["Building Exterior", "Photography", "Low-Angle Architecture", "Exterior Shot"]
  },
  {
    id: "photo-04",
    title: "Building Interior Construction & Finished Space Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Capturing interior lighting, room depth, and architectural finishes",
    description: "Interior space photography documenting newly finished office interiors, residential living rooms, and lobby entrance foyers.",
    client: "Interior Craft Ltd.",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    software: ["DSLR Camera", "Lightroom"],
    specifications: {
      "Type": "Interior Architectural Photography",
      "Lighting": "Ambient + On-Location Soft Strobes"
    },
    tags: ["Building Interior", "Photography", "Interior Spaces", "Space Documentation"]
  },
  {
    id: "photo-05",
    title: "Construction Material Inspection & Concrete Slump Field Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Documenting rebar diameter checks, aggregate quality, and slump test",
    description: "Detailed macro and field photography capturing material sampling, steel rebar gauge measurements, concrete cylinder sampling, and site quality control.",
    client: "Materials Testing Lab",
    year: "2023",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    software: ["Field Logbook", "Lightroom"],
    specifications: {
      "Type": "Material QA/QC Photography",
      "Focus": "Rebar & Concrete Material Audit"
    },
    tags: ["Material Photography", "Photography", "Concrete Testing", "Quality Control"]
  },
  {
    id: "photo-06",
    title: "Project Progress Documentation & Surveying Photography",
    category: "photography",
    categoryLabel: "Photography",
    subtitle: "Periodic site progress tracking photo log for client status reports",
    description: "Systematic monthly construction photo log capturing foundation work, floor slab progress, masonry brickwork, and roof level completions.",
    client: "Project Management Board",
    year: "2024",
    location: "Dhaka, Bangladesh",
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    software: ["Lightroom", "PDF Report Generator"],
    specifications: {
      "Type": "Project Progress Documentation",
      "Frequency": "Bi-Weekly Progress Logs"
    },
    tags: ["Project Documentation", "Photography", "Progress Tracking", "Field Log"]
  }
];

export const SKILLS_CATEGORIES: SkillCategory[] = [
  {
    id: "technical-skills",
    title: "Engineering & Technical Skills",
    iconName: "Building2",
    skills: [
      { name: "AutoCAD 2D Drafting", level: 98, experienceYears: 6, description: "Floor plans, sections, elevations, working drawings, structural layouts & schedules.", icon: "DraftingCompass" },
      { name: "AutoCAD 3D Modeling", level: 95, experienceYears: 6, description: "3D building massing, structural models, architectural concepts & solid geometry.", icon: "Box" },
      { name: "3ds Max Visualization", level: 94, experienceYears: 5, description: "Realistic interior & exterior rendering, V-Ray/Corona materials, HDRI lighting & cameras.", icon: "Sparkles" },
      { name: "Building Layout Design", level: 92, experienceYears: 6, description: "Residential & commercial layout planning, room circulation & code setbacks.", icon: "Layers" },
      { name: "Working Drawing Preparation", level: 96, experienceYears: 6, description: "Construction-ready documentation, door/window schedules, detail blowups & permit sets.", icon: "FileText" },
      { name: "Construction Site Supervision", level: 88, experienceYears: 4, description: "Site execution, field coordination, rebar checking & quality control walkthroughs.", icon: "HardHat" },
      { name: "Quantity Estimation (Basic)", level: 85, experienceYears: 5, description: "Material quantity calculation, concrete volume, steel rebar weight & BOQ sheet.", icon: "Calculator" },
      { name: "Structural Drafting", level: 92, experienceYears: 5, description: "Beam, column, slab & foundation structural drawings and rebar bending schedules.", icon: "SquareCode" },
      { name: "Engineering Documentation", level: 90, experienceYears: 5, description: "Technical reports, drawing sheets, site logs & client presentation files.", icon: "FileCheck" },
      { name: "Interior Visualization", level: 93, experienceYears: 5, description: "Furniture layout, lighting concepts, material textures & realistic indoor renders.", icon: "Home" },
      { name: "Exterior Visualization", level: 95, experienceYears: 5, description: "Building façade design, landscape rendering, dusk/day views & environment setup.", icon: "Sun" },
      { name: "AI-Assisted Design", level: 88, experienceYears: 2, description: "AI tools for rapid concept generation, moodboards, architectural prompts & presentation.", icon: "Cpu" },
      { name: "Photography", level: 86, experienceYears: 4, description: "Architectural photography, construction site progress tracking & material photos.", icon: "Camera" },
      { name: "Adobe Photoshop", level: 90, experienceYears: 6, description: "Presentation boards, render post-processing, color grading & architectural touchups.", icon: "Image" },
      { name: "Microsoft Office", level: 92, experienceYears: 6, description: "Word for technical specs, Excel for quantity takeoffs, PowerPoint for client pitch.", icon: "FileCode2" }
    ]
  }
];

export const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: "autocad",
    name: "AutoCAD",
    category: "2D Drafting & 3D CAD",
    version: "2024 / 2025",
    proficiency: 98,
    description: "Primary CAD software for producing accurate floor plans, structural layouts, working drawings, elevation sections, and 3D solid models.",
    iconName: "PenTool",
    keyWorkflows: ["Floor Plans & Sections", "Structural Rebar Layouts", "3D Solid Massing", "Plotting & Sheet Sets"],
    primaryUse: "Creation of precision 2D construction drawings and 3D CAD models",
    badgeColor: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
  },
  {
    id: "3dsmax",
    name: "Autodesk 3ds Max",
    category: "3D Visualization & Rendering",
    version: "2024",
    proficiency: 94,
    description: "Premier 3D modeling and architectural rendering software for creating photorealistic interior and exterior renders using V-Ray & Corona.",
    iconName: "Sparkles",
    keyWorkflows: ["Photorealistic Exterior/Interior", "V-Ray & Corona Render Engine", "PBR Material Setup", "HDRI Lighting"],
    primaryUse: "Transforming CAD drawings into ultra-realistic 3D presentations",
    badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    category: "Post-Processing & Graphics",
    version: "CC 2024",
    proficiency: 90,
    description: "Essential post-processing tool for enhancing 3ds Max renders, color grading, adding entourage, and designing presentation boards.",
    iconName: "Image",
    keyWorkflows: ["Render Post-Production", "Architectural Board Layout", "Sky Replacement & Lighting FX", "Plan Colorization"],
    primaryUse: "Final retouching and client presentation board creation",
    badgeColor: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
  },
  {
    id: "powerpoint",
    name: "Microsoft PowerPoint",
    category: "Client Presentations",
    version: "Office 365",
    proficiency: 92,
    description: "Used to create professional project proposals, design decks, and client presentation walkthrough slide decks.",
    iconName: "Presentation",
    keyWorkflows: ["Project Proposals", "Client Pitch Decks", "Design Walkthroughs"],
    primaryUse: "Creating clear, visually engaging architectural client pitch decks",
    badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
  },
  {
    id: "word",
    name: "Microsoft Word",
    category: "Engineering Documentation",
    version: "Office 365",
    proficiency: 92,
    description: "Utilized for drafting formal technical specifications, project agreements, drawing cover sheets, and site inspection reports.",
    iconName: "FileText",
    keyWorkflows: ["Technical Specifications", "Site Inspection Logs", "Formal Agreements"],
    primaryUse: "Drafting formal engineering documentation & client reports",
    badgeColor: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
  },
  {
    id: "excel",
    name: "Microsoft Excel",
    category: "Quantity Takeoff & Data",
    version: "Office 365",
    proficiency: 94,
    description: "Used for quantity estimation, material cost breakdowns, door/window schedules, and Bill of Quantities (BOQ) calculations.",
    iconName: "Calculator",
    keyWorkflows: ["Bill of Quantities (BOQ)", "Material Quantity Takeoffs", "Cost Breakdown Spreadsheets"],
    primaryUse: "Quantity surveying & material cost estimation",
    badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
  },
  {
    id: "canva",
    name: "Canva",
    category: "Design & Social Media",
    version: "Pro",
    proficiency: 90,
    description: "Quick graphic design software for portfolio banners, marketing collateral, social media posts, and visual documentation.",
    iconName: "Layout",
    keyWorkflows: ["Social Media Showcase", "Portfolio Banners", "Marketing Flyers"],
    primaryUse: "Visual branding and graphic marketing collateral",
    badgeColor: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300"
  },
  {
    id: "aistudio",
    name: "Google AI Studio",
    category: "AI Design & Creative Assistant",
    version: "Latest",
    proficiency: 88,
    description: "Leveraged for AI-assisted architectural concept generation, quick prompt iteration, text descriptions, and presentation enhancement.",
    iconName: "Cpu",
    keyWorkflows: ["AI Architectural Prompts", "Concept Generation", "Design Brief Summaries"],
    primaryUse: "AI-assisted design ideation and presentation creation",
    badgeColor: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
  }
];

export const SERVICES_DATA: EngineeringService[] = [
  {
    id: "srv-01",
    title: "AutoCAD 2D Drafting",
    category: "CAD Services",
    iconName: "DraftingCompass",
    summary: "Precision 2D AutoCAD floor plans, sections, elevations, structural drawings, and construction-ready working drawing sets.",
    deliverables: [
      "AutoCAD .DWG Source File & High-Res PDF Plot",
      "Architectural Floor Plans & Layout Dimensions",
      "Front, Rear & Side Elevation Drawings",
      "Building Sections & Staircase Cutaways",
      "Permit-Ready Working Drawing Set"
    ],
    turnaroundDays: "2 - 4 Business Days",
    startingRate: "$150",
    popular: true
  },
  {
    id: "srv-02",
    title: "AutoCAD 3D Modeling",
    category: "3D CAD Services",
    iconName: "Box",
    summary: "Creation of accurate 3D solid CAD models for residential houses, commercial buildings, villas, and duplex residences.",
    deliverables: [
      "3D AutoCAD Solid .DWG Model",
      "Isometric CAD Views & Section Cutaways",
      "3D Facade & Roof Geometry",
      "Exported Formats (3DS, OBJ, STEP)"
    ],
    turnaroundDays: "3 - 5 Business Days",
    startingRate: "$250"
  },
  {
    id: "srv-03",
    title: "3ds Max Modeling",
    category: "3D Modeling",
    iconName: "Sparkles",
    summary: "Detailed 3ds Max high-polygon architectural modeling for interiors, exteriors, landscapes, and complex building facades.",
    deliverables: [
      "3ds Max Source Project File (.MAX)",
      "High-Polygon Architectural Geometry",
      "Clean Material Map Assignments",
      "3D Camera Positioning"
    ],
    turnaroundDays: "3 - 6 Business Days",
    startingRate: "$300"
  },
  {
    id: "srv-04",
    title: "Photorealistic Rendering",
    category: "3D Visualization",
    iconName: "SunMedium",
    summary: "Ultra-realistic 4K / 8K V-Ray and Corona exterior & interior renders with physically accurate lighting and PBR materials.",
    deliverables: [
      "4K / 8K High-Resolution Renders",
      "Daytime & Evening HDRI Lighting Views",
      "Photoshop Post-Processed Retouched Images",
      "Clay / Wireframe Comparison Views"
    ],
    turnaroundDays: "3 - 5 Business Days",
    startingRate: "$350",
    popular: true
  },
  {
    id: "srv-05",
    title: "Floor Plan Design",
    category: "Architectural Planning",
    iconName: "Layers",
    summary: "Custom residential and commercial floor plan space planning optimized for room circulation, ventilation, and furniture layout.",
    deliverables: [
      "Dimensioned Floor Plan Layout",
      "Furniture & Fixture Arrangement",
      "Door & Window Opening Schedules",
      "Room Area Calculations"
    ],
    turnaroundDays: "2 - 3 Business Days",
    startingRate: "$120"
  },
  {
    id: "srv-06",
    title: "Building Layout Design",
    category: "Master Planning",
    iconName: "Building2",
    summary: "Comprehensive building floor layouts, setback calculations, parking arrangements, and compliance with zoning rules.",
    deliverables: [
      "Master Building Layout Plan",
      "Zoning Setback Compliance Map",
      "Circulation & Entry Egress Plan"
    ],
    turnaroundDays: "3 - 5 Business Days",
    startingRate: "$200"
  },
  {
    id: "srv-07",
    title: "Working Drawings",
    category: "Construction Documentation",
    iconName: "FileText",
    summary: "Execution-ready construction working drawings covering masonry brickwork, wall details, openings, and finishing schedules.",
    deliverables: [
      "Complete Construction Working Drawing Package",
      "Brickwork & Partition Wall Layouts",
      "Door/Window Detail Blowups",
      "Finishing Material Schedule Sheets"
    ],
    turnaroundDays: "4 - 7 Business Days",
    startingRate: "$300"
  },
  {
    id: "srv-08",
    title: "Structural Drafting",
    category: "Structural Services",
    iconName: "SquareCode",
    summary: "2D AutoCAD structural drawings including column placement grids, beam reinforcement details, slab rebar, and footing layouts.",
    deliverables: [
      "Column Grid Layout & Schedule",
      "Beam Reinforcement Cutaway Details",
      "Slab Top/Bottom Rebar Layout",
      "Foundation & Footing Plan"
    ],
    turnaroundDays: "3 - 6 Business Days",
    startingRate: "$280"
  },
  {
    id: "srv-09",
    title: "Construction Drawings",
    category: "Site Documentation",
    iconName: "HardHat",
    summary: "On-site construction drawings for contractors, field engineers, and site supervisors for smooth execution.",
    deliverables: [
      "Site Execution Drawing Print Sets",
      "Grid Dimension Verification Maps",
      "Plumbing & Electrical Overlay Drawings"
    ],
    turnaroundDays: "3 - 5 Business Days",
    startingRate: "$220"
  },
  {
    id: "srv-10",
    title: "Site Planning",
    category: "Land Planning",
    iconName: "MapPin",
    summary: "Master plot layout design, approach road radius, property line boundaries, drainage flow directions, and green zones.",
    deliverables: [
      "Plot Boundary Site Plan",
      "Driveway & Parking Layout",
      "Drainage & Utility Pathways"
    ],
    turnaroundDays: "2 - 4 Business Days",
    startingRate: "$180"
  },
  {
    id: "srv-11",
    title: "Interior Visualization",
    category: "Interior Design",
    iconName: "Home",
    summary: "3D interior rendering for living rooms, bedrooms, kitchens, and offices with realistic lighting, textures, and decor.",
    deliverables: [
      "3D Interior Render Images",
      "Lighting & Mood Color Options",
      "Furniture & Material Color Palette"
    ],
    turnaroundDays: "3 - 5 Business Days",
    startingRate: "$250"
  },
  {
    id: "srv-12",
    title: "Exterior Visualization",
    category: "Facade Design",
    iconName: "Sun",
    summary: "Photorealistic 3D renders of building exteriors, modern facades, roof gardens, landscaping, and night lighting.",
    deliverables: [
      "3D Facade Exterior Renders",
      "Daytime & Night Sky Render Variations",
      "Landscape & Greenery Integration"
    ],
    turnaroundDays: "3 - 6 Business Days",
    startingRate: "$320"
  },
  {
    id: "srv-13",
    title: "Presentation Design",
    category: "Client Pitch",
    iconName: "Presentation",
    summary: "Designing high-impact architectural pitch decks, presentation boards, Canva graphics, and PowerPoint slide decks.",
    deliverables: [
      "PowerPoint Pitch Deck (.PPTX)",
      "A1/A0 Architectural Presentation Boards",
      "High-Res Exported Graphic Images"
    ],
    turnaroundDays: "2 - 3 Business Days",
    startingRate: "$150"
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "test-01",
    clientName: "Eng. Kamrul Hassan",
    role: "Project Director",
    company: "Green Valley Real Estate Ltd.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "MD Arif Mia provided exceptional AutoCAD 2D floor plans and working drawings for our residential housing project. His practical construction site experience shines through every detail, making site execution effortless for our field engineers!",
    projectType: "Residential Floor Plans & Working Drawings",
    date: "November 2024"
  },
  {
    id: "test-02",
    clientName: "Tanzim Rahman",
    role: "Principal Architect",
    company: "Urban Edge Architects",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "Arif's 3ds Max visualization renders are simply stunning! The V-Ray lighting and textures gave our commercial plaza project a real competitive edge during client presentations. Highly recommended!",
    projectType: "3ds Max Exterior Renders & 3D CAD Modeling",
    date: "September 2024"
  },
  {
    id: "test-03",
    clientName: "Mahmudul Alam",
    role: "Managing Director",
    company: "Apex Construction Group",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    quote: "Fast, accurate, and reliable! MD Arif Mia handled our structural drafting, staircase details, and site elevation drawings flawlessly. His communication and turnaround time are top notch.",
    projectType: "Structural Drawings & 3D Building Models",
    date: "February 2024"
  }
];

export const CAREER_MILESTONES: CareerMilestone[] = [
  {
    period: "2025 - Present",
    role: "Civil Engineering Designer & CAD / 3D Visualization Specialist",
    company: "Freelance & Structural Consulting Studio",
    location: "Dhaka, Bangladesh",
    description: "Delivering AutoCAD 2D drafting, 3D CAD modeling, 3ds Max architectural visualization, and site planning for residential & commercial clients.",
    achievements: [
      "Completed over 250+ AutoCAD 2D/3D and 3ds Max rendering projects with 99% client satisfaction.",
      "Prepared complete construction-ready working drawing permit sets for residential and commercial buildings.",
      "Conducted site supervision walkthroughs ensuring practical design execution on active construction sites."
    ]
  },
  {
    period: "2023 - 2024",
    role: "Civil Draftsman & Site Coordinator",
    company: "Metro Structural & Construction Ltd.",
    location: "Dhaka, Bangladesh",
    description: "Prepared architectural floor plans, RCC rebar structural drawings, foundation layouts, and conducted field measurement surveys.",
    achievements: [
      "Drafted over 150+ CAD sheet sets complying with national building codes.",
      "Supervised rebar placement and concrete pouring quality on high-rise residential building sites."
    ]
  }
];

export const PROJECT_STATS: ProjectStat[] = [
  {
    id: "stat-01",
    label: "Projects Completed",
    value: 250,
    suffix: "+",
    iconName: "CheckCircle2",
    subtext: "Delivered On Time with High Precision"
  },
  {
    id: "stat-02",
    label: "Years of Experience",
    value: 3,
    suffix: "+",
    iconName: "Briefcase",
    subtext: "Hands-On Site & Design Office Experience"
  },
  {
    id: "stat-03",
    label: "Happy Clients",
    value: 180,
    suffix: "+",
    iconName: "Users",
    subtext: "Worldwide & Local Construction Clients"
  },
  {
    id: "stat-04",
    label: "Design Accuracy",
    value: 100,
    suffix: "%",
    iconName: "ShieldCheck",
    subtext: "Code-Compliant & Construction-Ready"
  },
  {
    id: "stat-05",
    label: "Client Satisfaction",
    value: 99,
    suffix: "%",
    iconName: "Award",
    subtext: "Positive Reviews & Repeat Clients"
  }
];
