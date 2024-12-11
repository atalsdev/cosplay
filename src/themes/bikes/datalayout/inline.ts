export const inlineLayout = {
  wrapper: (content: string) => `
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex flex-wrap gap-4">
          ${content}
        </div>
      </div>
    </div>
  `,
  section: (content: string) => content,
  field: (label: string, value: string) => `
    <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
      <span class="text-sm text-gray-500">${label}:</span>
      <span class="text-sm font-semibold text-gray-900">${value}</span>
    </div>
  `
}; 