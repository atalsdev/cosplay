export const cardsLayout = {
  wrapper: (content: string) => `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${content}
    </div>
  `,
  section: (content: string) => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-3">
          ${content}
        </div>
      </div>
    </div>
  `,
  field: (label: string, value: string) => `
    <div class="flex flex-col">
      <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">${label}</span>
      <span class="mt-1 text-lg font-semibold text-gray-900">${value}</span>
    </div>
  `
}; 