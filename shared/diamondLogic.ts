/* Style direction: Dark Cosmic Luxury — narrative scoring stays deterministic, auditable and independent from the visual layer. */
export type DiamondMemory = Record<string, number>;
export type AnsweredDiamonds = Record<number, boolean>;

export function applyDiamondAnswer(memory: DiamondMemory, answered: AnsweredDiamonds, diamondIndex: number, axis: string, choiceIndex: number) {
  if (answered[diamondIndex]) return { memory, answered, applied: false };
  return {
    memory: { ...memory, [axis]: Math.min(100, (memory[axis] || 0) + (choiceIndex === 0 ? 26 : 11)) },
    answered: { ...answered, [diamondIndex]: true },
    applied: true,
  };
}
