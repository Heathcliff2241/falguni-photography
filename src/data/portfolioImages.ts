import { PortfolioImage } from '../types';

import newbornWreath from '../assets/images/newborn_floral_wreath_1785043810190.jpg';
import newbornBlue from '../assets/images/newborn_blue_wrap_1785043822438.jpg';
import maternityPurple from '../assets/images/maternity_purple_gown_1785043836226.jpg';
import familyBlue from '../assets/images/family_blue_attire_1785043847819.jpg';
import cakeSmash from '../assets/images/cake_smash_birthday_1785043899473.jpg';
import studioInterior from '../assets/images/studio_interior_props_1785043925769.jpg';

const studioCouple = 'https://scontent.fceb1-2.fna.fbcdn.net/v/t39.30808-6/492338892_664603936368485_893668748178494389_n.jpg?stp=dst-jpg_tt6&cstp=mx1068x1067&ctp=s1068x1067&_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeE4Jun_US60n9N4vWPuIVbHkR7uDfe2NLmRHu4N97Y0uTQeuXhn43R-ybNTHRD2CFpGlKl7SAm3Zs_L9L9PSx2y&_nc_ohc=dUjdeQgyJcgQ7kNvwGEfCq-&_nc_oc=AdoGeY_wqMVGyEd2tEhkc64ei0uEpukZMareAbREfr7EaI-4GfG7HUGEeJROCtOAWVM&_nc_pt=1&_nc_zt=23&_nc_ht=scontent.fceb1-2.fna&_nc_gid=Nae5TP_idlRAyfeW8ZCiqw&_nc_ss=7b2a8&oh=00_AQDiNl4buRYqlw2MQ2DDMONrHUlAZTgJKtbNh83TTT87qw&oe=6A6E2B5A';
const falguniPortrait = studioCouple;

export {
  newbornWreath,
  newbornBlue,
  maternityPurple,
  familyBlue,
  cakeSmash,
  studioCouple,
  falguniPortrait,
  studioInterior
};

export const PORTFOLIO_IMAGES: PortfolioImage[] = [
  {
    id: 'nb-1',
    title: 'Floral Wreath Newborn Session',
    category: 'newborn',
    src: newbornWreath,
    alt: 'Newborn baby asleep on a green floral wreath backdrop with white roses, Northfield photography studio',
    description: 'Soft organic cream wrap, eucalyptus wreath, white roses, and gentle natural studio lighting.',
    rotation: '-rotate-2',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'nb-2',
    title: 'Pastel Blue Swaddle & Teddy Bear',
    category: 'newborn',
    src: newbornBlue,
    alt: 'Newborn baby wrapped in blue fabric asleep with a teddy bear, Northfield newborn photography',
    description: 'Serene newborn wrapped in soft pastel blue fabric alongside a tiny handmade miniature teddy bear.',
    rotation: 'rotate-1',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'mat-1',
    title: 'Deep Purple Draped Gown Maternity',
    category: 'maternity',
    src: maternityPurple,
    alt: 'Maternity portrait in flowing purple gown against purple backdrop, Northfield studio',
    description: 'Flowing purple chiffon gown with delicate drapery and flattering studio portrait light.',
    rotation: '-rotate-1',
    aspect: 'aspect-[3/4]'
  },
  {
    id: 'fam-1',
    title: 'Formal Navy Blue Family Portrait',
    category: 'family',
    src: familyBlue,
    alt: 'Family portrait session in formal blue attire, Northfield photography studio',
    description: 'Warm, joyful family portrait with adults and child in formal navy attire.',
    rotation: 'rotate-2',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'cake-1',
    title: 'First Birthday Balloon & Cake Smash',
    category: 'cake-smash',
    src: cakeSmash,
    alt: 'Baby first birthday cake smash session at Northfield photography studio',
    description: 'Joyful 1-year-old celebrating with a pastel balloon arch, flower garland, and smash cake.',
    rotation: '-rotate-2',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'std-1',
    title: 'Falguni - Studio Owner & Photographer',
    category: 'newborn',
    src: studioCouple,
    alt: 'Falguni, owner and photographer of Falguni\'s Photography, Northfield studio',
    description: 'Meet Falguni in her Northfield studio surrounded by newborn wraps and props.',
    rotation: 'rotate-1',
    aspect: 'aspect-[4/3]'
  },
  {
    id: 'std-2',
    title: 'Boutique Studio Props & Wraps',
    category: 'newborn',
    src: studioInterior,
    alt: 'Falguni\'s Photography studio interior with organic wraps, baskets, and floral crowns',
    description: 'Shelving organized with pastel blankets, wooden bowls, and handcrafted newborn accessories.',
    rotation: '-rotate-1',
    aspect: 'aspect-[16/9]'
  }
];
