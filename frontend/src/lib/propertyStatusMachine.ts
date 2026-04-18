import type { PropertyStatus } from '../store/usePropertyStore';

export const STATUS_TRANSITIONS: Record<PropertyStatus, PropertyStatus[]> = {
  available:   ['leased', 'maintenance'],
  leased:      ['overdue', 'maintenance'],
  overdue:     ['eviction', 'leased'],
  eviction:    ['maintenance'],
  maintenance: ['available'],
};

export function getValidTransitions(current: PropertyStatus): PropertyStatus[] {
  return STATUS_TRANSITIONS[current] ?? [];
}

export function isValidTransition(from: PropertyStatus, to: PropertyStatus): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
