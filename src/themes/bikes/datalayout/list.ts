export const listLayout = {
  wrapper: (content: string) => `
    <div class="max-w-3xl mx-auto">
      ${content}
    </div>
  `,
  section: (content: string) => `
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dl class="space-y-4">
          ${content}
        </dl>
      </div>
    </div>
  `,
  field: (label: string, value: string) => `
    <div class="flex justify-between gap-4 py-3 border-b border-gray-200 last:border-0">
      <dt class="text-sm font-medium text-gray-500">${label}</dt>
      <dd class="text-sm font-semibold text-gray-900">${value}</dd>
    </div>
  `
}; 