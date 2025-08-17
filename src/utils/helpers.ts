import type { Participant } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Enhanced color palette with better harmony and contrast
const ROULETTE_COLORS = [
  '#FF6B6B', // Vibrant Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Mint Green
  '#FFEAA7', // Sunny Yellow
  '#DDA0DD', // Plum
  '#FF8A80', // Light Red
  '#80CBC4', // Cyan
  '#81C784', // Light Green
  '#FFB74D', // Orange
  '#CE93D8', // Light Purple
  '#F06292', // Pink
  '#64B5F6', // Light Blue
  '#A5D6A7', // Pale Green
  '#FFCC02', // Golden Yellow
  '#BA68C8', // Medium Purple
  '#26C6DA', // Light Cyan
  '#66BB6A', // Green
  '#FF7043', // Deep Orange
  '#AB47BC'  // Purple
];

export function getRandomColor(): string {
  return ROULETTE_COLORS[Math.floor(Math.random() * ROULETTE_COLORS.length)];
}

// Enhanced function to get well-distributed colors for roulette segments
export function getRouletteColors(participantCount: number): string[] {
  if (participantCount <= 0) return [];
  
  // For small numbers, use predefined optimal sequences
  if (participantCount <= ROULETTE_COLORS.length) {
    return getOptimalColorSequence(participantCount);
  }
  
  // For larger numbers, repeat the palette
  const colors: string[] = [];
  for (let i = 0; i < participantCount; i++) {
    colors.push(ROULETTE_COLORS[i % ROULETTE_COLORS.length]);
  }
  
  return colors;
}

// Get optimal color sequence to avoid similar adjacent colors
function getOptimalColorSequence(count: number): string[] {
  if (count === 1) return [ROULETTE_COLORS[0]];
  
  // Pre-calculated optimal sequences for common participant counts
  const optimalSequences: { [key: number]: number[] } = {
    2: [0, 10], // Red, Light Purple - maximum contrast
    3: [0, 5, 12], // Red, Plum, Light Blue
    4: [0, 5, 12, 8], // Red, Plum, Light Blue, Light Green
    5: [0, 5, 12, 8, 14], // Add Golden Yellow
    6: [0, 5, 12, 8, 14, 2], // Add Blue
    7: [0, 5, 12, 8, 14, 2, 15], // Add Medium Purple
    8: [0, 5, 12, 8, 14, 2, 15, 1], // Add Teal
    9: [0, 5, 12, 8, 14, 2, 15, 1, 18], // Add Deep Orange
    10: [0, 5, 12, 8, 14, 2, 15, 1, 18, 3], // Add Mint Green
  };
  
  if (optimalSequences[count]) {
    return optimalSequences[count].map(index => ROULETTE_COLORS[index]);
  }
  
  // For other counts, use a distribution algorithm
  return distributeColorsEvenly(count);
}

// Distribute colors evenly across the color wheel to maximize contrast
function distributeColorsEvenly(count: number): string[] {
  const colors: string[] = [];
  const step = Math.floor(ROULETTE_COLORS.length / count);
  const startIndex = 0;
  
  for (let i = 0; i < count; i++) {
    const colorIndex = (startIndex + i * step) % ROULETTE_COLORS.length;
    colors.push(ROULETTE_COLORS[colorIndex]);
  }
  
  return colors;
}

export function selectRandomParticipant(participants: Participant[]): Participant | null {
  if (participants.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * participants.length);
  return participants[randomIndex];
}

export function calculateRouletteRotation(
  selectedIndex: number, 
  totalParticipants: number,
  currentRotation: number = 0,
  extraRotations: number = 4
): number {
  if (totalParticipants === 0) return 0;
  
  // Calculate the angle for each segment in degrees
  const segmentAngle = 360 / totalParticipants;
  
  // Where is the selected segment currently positioned?
  // Segment center starts at: -90 + selectedIndex * segmentAngle + segmentAngle/2
  const initialSegmentCenter = -90 + selectedIndex * segmentAngle + (segmentAngle / 2);
  
  // After current rotation, where is it now?
  const currentSegmentCenter = (initialSegmentCenter + currentRotation) % 360;
  
  // How much do we need to rotate to get it to -90 degrees (pointer position)?
  const targetPosition = -90;
  let rotationNeeded = targetPosition - currentSegmentCenter;
  
  // Normalize to shortest path
  if (rotationNeeded > 180) rotationNeeded -= 360;
  if (rotationNeeded < -180) rotationNeeded += 360;
  
  // Add specified rotations for dramatic effect
  const totalRotationToAdd = (extraRotations * 360) + rotationNeeded;
  
  return totalRotationToAdd;
}

export function getSegmentAtTop(totalRotation: number, totalParticipants: number): number {
  if (totalParticipants === 0) return 0;
  
  // Normalize rotation to 0-360 range
  const normalizedRotation = ((totalRotation % 360) + 360) % 360;
  
  const segmentAngle = 360 / totalParticipants;
  
  // After rotation, find which segment center is closest to the pointer position (-90°)
  // Segment i center is at: -90 + i * segmentAngle + segmentAngle/2
  // After rotation by totalRotation, it moves to: initialPosition + totalRotation
  
  let closestSegment = 0;
  let minDistance = Infinity;
  
  for (let i = 0; i < totalParticipants; i++) {
    // Initial position of segment i center
    const initialCenter = -90 + i * segmentAngle + segmentAngle / 2;
    
    // Position after rotation
    const finalCenter = (initialCenter + normalizedRotation) % 360;
    
    // Distance to pointer position (-90° or 270°)
    const targetPos = 270; // -90° in positive degrees
    let distance = Math.abs(finalCenter - targetPos);
    
    // Handle wrap-around (shortest distance on circle)
    if (distance > 180) {
      distance = 360 - distance;
    }
    
    if (distance < minDistance) {
      minDistance = distance;
      closestSegment = i;
    }
  }
  
  return closestSegment;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function getContrastColor(hexColor: string): string {
  // Remove the hash if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getGradientColors(count: number): string[] {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(gradients[i % gradients.length]);
  }
  return result;
}