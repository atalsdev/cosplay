export const luxuryComponentStyle = {
  // Key Features component styles
  keyFeatures: {
    wrapper: "bg-white border border-gray-100 rounded-xl p-6 shadow-sm",
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    list: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    icon: "w-5 h-5 text-green-500 flex-shrink-0",
    text: "font-['Montserrat'] text-base font-light text-gray-700"
  },

  // Product FAQ styles
  faq: {
    wrapper: "bg-white border border-gray-100 rounded-xl p-6 shadow-sm",
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    list: "space-y-4",
    item: "border-b border-gray-100 last:border-0 pb-4 last:pb-0",
    question: "font-['Montserrat'] text-base font-medium text-gray-900 mb-2",
    answer: "font-['Montserrat'] text-base font-light text-gray-600"
  },

  // Product Loading styles
  loading: {
    wrapper: "product-loading fixed inset-0 bg-white z-50",
    container: "max-w-7xl mx-auto px-4 py-12",
    grid: "grid grid-cols-1 lg:grid-cols-2 gap-12",
    imageSkeleton: "aspect-square bg-gray-200 rounded-2xl",
    contentSkeleton: {
      wrapper: "space-y-6",
      titleBlock: "space-y-4",
      titleLine: "h-8 bg-gray-200 rounded w-3/4",
      subtitleLine: "h-4 bg-gray-200 rounded w-1/4",
      priceLine: "h-12 bg-gray-200 rounded w-1/3",
      optionsBlock: "space-y-4",
      optionLine: "h-12 bg-gray-200 rounded"
    }
  },

  // Product Specs styles
  specs: {
    wrapper: "bg-white border border-gray-100 rounded-xl p-6 shadow-sm",
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-4",
    item: "flex items-center gap-2",
    label: "font-['Montserrat'] text-sm font-medium text-gray-700",
    value: "font-['Montserrat'] text-sm font-light text-gray-600"
  },

  // Reviews styles
  reviews: {
    wrapper: "border-t pt-8",
    title: "font-['Montserrat'] text-2xl font-light tracking-wide mb-6 flex items-center gap-2",
    list: "space-y-6",
    review: {
      wrapper: "bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow mb-4",
      header: "flex items-center justify-between mb-4",
      authorBlock: "flex items-center gap-4",
      avatar: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center",
      avatarText: "text-blue-600 font-semibold",
      authorInfo: {
        name: "font-['Montserrat'] font-medium text-gray-900",
        meta: "text-sm text-gray-500 flex items-center gap-2",
        verified: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
      },
      rating: "flex text-yellow-400",
      content: "font-['Montserrat'] text-base font-light text-gray-700"
    },
    showMore: {
      wrapper: "text-center pt-6",
      button: "font-['Montserrat'] inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-light text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    }
  },

  // Size Chart styles
  sizeChart: {
    wrapper: "border-t pt-8",
    title: "font-['Montserrat'] text-2xl font-light tracking-wide mb-6 flex items-center gap-2",
    table: {
      wrapper: "overflow-x-auto bg-white rounded-xl shadow-sm",
      table: "min-w-full divide-y divide-gray-200",
      header: "bg-gray-50",
      headerCell: "font-['Montserrat'] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
      row: "hover:bg-gray-50 transition-colors",
      cell: "font-['Montserrat'] px-6 py-4 whitespace-nowrap text-sm text-gray-500"
    },
    tips: {
      wrapper: "mt-4 bg-blue-50 rounded-xl p-4",
      title: "font-['Montserrat'] font-semibold mb-2 text-sm text-blue-700",
      list: "list-disc list-inside space-y-1 font-['Montserrat'] text-sm text-blue-700"
    }
  }
}; 