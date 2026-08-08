import React from 'react';
import {
  Building2,
  PenTool,
  Sparkles,
  Layers,
  SquareCode,
  Activity,
  Compass,
  Waves,
  DraftingCompass,
  Box,
  Map,
  FileText,
  Cuboid,
  Sun,
  SunMedium,
  Image,
  Workflow,
  HardHat,
  Calculator,
  Award,
  ShieldCheck,
  CheckCircle2,
  Boxes,
  MapPin,
  HelpCircle
} from 'lucide-react';

interface IconHelperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = "w-5 h-5", size = 20 }) => {
  switch (name) {
    case 'Building2': return <Building2 className={className} size={size} />;
    case 'PenTool': return <PenTool className={className} size={size} />;
    case 'Sparkles': return <Sparkles className={className} size={size} />;
    case 'Layers': return <Layers className={className} size={size} />;
    case 'SquareCode': return <SquareCode className={className} size={size} />;
    case 'Activity': return <Activity className={className} size={size} />;
    case 'Compass': return <Compass className={className} size={size} />;
    case 'Waves': return <Waves className={className} size={size} />;
    case 'DraftingCompass': return <DraftingCompass className={className} size={size} />;
    case 'Box': return <Box className={className} size={size} />;
    case 'Map': return <Map className={className} size={size} />;
    case 'FileText': return <FileText className={className} size={size} />;
    case 'Cuboid': return <Cuboid className={className} size={size} />;
    case 'Sun': return <Sun className={className} size={size} />;
    case 'SunMedium': return <SunMedium className={className} size={size} />;
    case 'Image': return <Image className={className} size={size} />;
    case 'Workflow': return <Workflow className={className} size={size} />;
    case 'HardHat': return <HardHat className={className} size={size} />;
    case 'Calculator': return <Calculator className={className} size={size} />;
    case 'Award': return <Award className={className} size={size} />;
    case 'ShieldCheck': return <ShieldCheck className={className} size={size} />;
    case 'CheckCircle2': return <CheckCircle2 className={className} size={size} />;
    case 'Boxes': return <Boxes className={className} size={size} />;
    case 'MapPin': return <MapPin className={className} size={size} />;
    default: return <HelpCircle className={className} size={size} />;
  }
};
