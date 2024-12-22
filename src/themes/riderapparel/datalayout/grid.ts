export const gridLayout = {
  wrapper: (content: string) => `
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      ${content}
    </div>
  `,
  section: (content: string) => `
    <div class="p-6 space-y-8">
      ${content}
    </div>
  `,
  field: (label: string, value: string) => `
    <div>
      <p class="text-sm font-medium text-indigo-600 uppercase">${label}</p>
      <p class="mt-1 text-2xl font-semibold text-gray-900">${value}</p>
    </div>
  `
}; 