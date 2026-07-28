import React from 'react';
import {
  Siren,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Paintbrush,
  Droplets,
  TrafficCone,
  HelpCircle,
  LucideProps,
} from 'lucide-react';
import { ReportCategory } from '../types';

interface CategoryIconProps extends LucideProps {
  category: ReportCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = "w-5 h-5", ...props }) => {
  switch (category) {
    case 'EMERGENCY':
      return <Siren className={className} {...props} />;
    case 'POTHOLE':
      return <AlertTriangle className={className} {...props} />;
    case 'LIGHTING':
      return <Lightbulb className={className} {...props} />;
    case 'SANITATION':
      return <Trash2 className={className} {...props} />;
    case 'VANDALISM':
      return <Paintbrush className={className} {...props} />;
    case 'WATER_LEAK':
      return <Droplets className={className} {...props} />;
    case 'ROADS_TRAFFIC':
      return <TrafficCone className={className} {...props} />;
    default:
      return <HelpCircle className={className} {...props} />;
  }
};
