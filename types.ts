export enum AspectRatio {
  Square = "1:1",
  Portrait = "3:4",
  Landscape = "4:3",
  Widescreen = "16:9",
  Tall = "9:16"
}

export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface Panel {
  id: string;
  panelNumber: number;
  description: string;
  dialogue: string;
  charactersInvolved: string[]; // IDs of characters
  imageUrl?: string;
  aspectRatio: AspectRatio;
  isGenerating?: boolean;
}

export interface ComicProject {
  title: string;
  genre: string;
  premise: string;
  style: string;
  characters: Character[];
  panels: Panel[];
}

export enum AppMode {
  Screenwriter = 'Screenwriter',
  CharacterDesign = 'CharacterDesign',
  Storyboard = 'Storyboard',
  Preview = 'Preview',
  Shop = 'Shop',
  AdminGrant = 'AdminGrant'
}

export type Language = 'en' | 'vi';

export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  type: string;
  priceVND: string;
  priceUSD: number;
  diamonds: number | 'Unlimited';
  rubies: number | 'Unlimited';
  benefits: string;
}

export interface UserProfile {
  plan: SubscriptionPlan;
  diamonds: number;
  rubies: number;
  avatarFrame?: string;
}