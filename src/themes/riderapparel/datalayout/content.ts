export const contentLayout = {
  wrapper: (content: string) => `
    <div class="p-6">
      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Overview Section -->
          <div id="mainContent"></div>
        </div>

        <!-- Right Column - Specifications -->
        <div class="lg:col-span-1">
          <!-- Characteristics Chart -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-lg font-semibold mb-4">Characteristics</h3>
            <canvas id="radarChart" width="300" height="300"></canvas>
          </div>

          <!-- Specifications -->
          <div class="bg-white rounded-lg shadow-md p-6">
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
    <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span class="text-sm text-gray-600">${label}</span>
      <span class="font-medium">${value}</span>
    </div>
  `
}; 