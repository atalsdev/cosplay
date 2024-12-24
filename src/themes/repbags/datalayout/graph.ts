export const graphLayout = {
  wrapper: (content: string) => `
    <div class="p-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/3">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${content}
          </div>
        </div>
        <div id="bikeSpecs" class="lg:w-1/3">
          <!-- Details will be inserted here -->
        </div>
      </div>
    </div>
  `,
  section: (content: string) => `
    <div class="space-y-4">
      ${content}
    </div>
  `,
  field: (label: string, value: string, chartId: string) => `
    <div class="bg-white rounded-lg shadow p-4">
      <canvas id="${chartId}" width="200" height="200"></canvas>
      <div class="mt-2 text-center">
        <p class="text-sm font-medium text-gray-500">${label}</p>
        <p class="text-lg font-semibold text-gray-900">${value}</p>
      </div>
    </div>
  `
}; 