import Minimalist from './Minimalist';
import Cyberpunk from './Cyberpunk';
import Corporate from './Corporate';

export const templateMap = {
  minimalist: Minimalist,
  cyberpunk: Cyberpunk,
  corporate: Corporate
};

export const TEMPLATES = [
  { id: 'minimalist', name: 'Minimalist', description: 'Clean typography, generous whitespace. Content first.' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon grids, glitch headers, terminal vibes.' },
  { id: 'corporate', name: 'Corporate', description: 'Two-column professional layout for senior roles.' }
];

export function getTemplate(templateId) {
  return templateMap[templateId] || Minimalist;
}
