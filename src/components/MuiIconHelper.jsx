import React from 'react';
import {
  Headphones,
  Watch,
  Laptop,
  CameraAlt,
  SportsEsports,
  Lightbulb,
  Category,
  Devices,
  ShoppingBag,
  Checkroom,
  FitnessCenter,
  Home,
  MenuBook,
  Smartphone,
  Tv,
  DirectionsCar,
  Kitchen,
  MusicNote
} from '@mui/icons-material';

const ICON_MAP = {
  Headphones,
  Watch,
  Laptop,
  CameraAlt,
  SportsEsports,
  Lightbulb,
  Category,
  Devices,
  ShoppingBag,
  Checkroom,
  FitnessCenter,
  Home,
  MenuBook,
  Smartphone,
  Tv,
  DirectionsCar,
  Kitchen,
  MusicNote
};

export const AVAILABLE_ICON_KEYS = Object.keys(ICON_MAP);

export default function MuiIconHelper({ iconKey, sx = {}, fontSize = "medium" }) {
  const IconComponent = ICON_MAP[iconKey] || Category;
  return <IconComponent sx={sx} fontSize={fontSize} />;
}
