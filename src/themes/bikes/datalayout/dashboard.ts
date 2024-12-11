export const dashboardLayout = {
  wrapper: (content: string) => `
    <div class="bg-white rounded-lg shadow">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${content}
        </div>
      </div>
    </div>
  `,
  section: (content: string) => content,
  field: (label: string, value: string) => `
    <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <dt class="text-sm font-medium text-gray-500 truncate">${label}</dt>
      <dd class="mt-2 text-2xl font-semibold text-gray-900">${value}</dd>
    </div>
  `
}; 