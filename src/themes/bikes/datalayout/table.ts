export const tableLayout = {
  wrapper: (content: string) => `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <tbody class="bg-white divide-y divide-gray-200">
          ${content}
        </tbody>
      </table>
    </div>
  `,
  section: (content: string) => content,
  field: (label: string, value: string) => `
    <tr>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">${label}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${value}</td>
    </tr>
  `
}; 