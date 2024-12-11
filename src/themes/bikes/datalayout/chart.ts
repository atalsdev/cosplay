export const chartLayout = {
  wrapper: (content: string) => `
    <div class="p-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <div class="lg:w-2/3">
          <div class="bg-white rounded-lg shadow p-6">
            <canvas id="radarChart" width="400" height="400"></canvas>
          </div>
        </div>
        <div id="bikeSpecs" class="lg:w-1/3">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Specifications</h3>
            <div class="space-y-3">
              ${content}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  section: (content: string) => content,
  field: (label: string, value: string) => `
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">${label}</span>
      <span class="font-medium">${value}</span>
    </div>
  `
}; 