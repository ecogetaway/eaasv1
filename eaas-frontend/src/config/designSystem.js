/**
 * Design System Configuration
 * Manages all components in the design system
 */

export const designSystemComponents = [
  {
    name: 'Button',
    status: 'stable',
    description: 'Button component with semantic colors and word-based sizes',
    route: '/design-system/button',
    group: 'ui',
  },
  {
    name: 'Badge',
    status: 'wip',
    description: 'Badge component for status indicators',
    route: '/design-system/badge',
    group: 'ui',
  },
];

/**
 * Get components by group
 * @param {string} group - 'ui' or 'complex'
 * @returns {Array} Filtered components
 */
export function getComponentsByGroup(group) {
  return designSystemComponents.filter(component => component.group === group);
}

/**
 * Get component by name
 * @param {string} name - Component name
 * @returns {Object|null} Component object or null
 */
export function getComponentByName(name) {
  return designSystemComponents.find(component => component.name === name) || null;
}

