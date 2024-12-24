export const luxuryProductStyle = {
  // Main product title and price
  title: "font-sans text-3xl font-light tracking-wide mb-2",
  price: "font-sans text-2xl font-light tracking-wide text-gray-900",
  
  // Breadcrumb typography
  breadcrumb: {
    link: "font-body text-sm font-light tracking-wide text-gray-600 hover:text-gray-900",
    current: "font-body text-sm font-light tracking-wide text-gray-900"
  },

  // Product description
  description: {
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    content: `
      font-['Montserrat'] text-gray-700 

      [&>p]:mb-6 
      [&>p]:leading-relaxed 
      [&>p]:text-base

      [&>h2]:text-xl 
      [&>h2]:font-bold 
      [&>h2]:text-gray-900 
      [&>h2]:mt-10 
      [&>h2]:mb-6
      [&>h2]:pb-2
      [&>h2]:border-b
      [&>h2]:border-gray-200

      [&>h3]:text-xl 
      [&>h3]:font-semibold 
      [&>h3]:text-gray-800 
      [&>h3]:mt-8 
      [&>h3]:mb-4
      [&>h3]:flex
      [&>h3]:items-center
      [&>h3]:gap-2

      [&>h4]:text-lg 
      [&>h4]:font-semibold 
      [&>h4]:text-gray-800 
      [&>h4]:mt-6 
      [&>h4]:mb-3

      [&>ul]:list-disc 
      [&>ul]:ml-6 
      [&>ul]:mb-6 
      [&>ul>li]:mb-2
      [&>ul>li]:text-gray-700

      [&>ol]:list-decimal 
      [&>ol]:ml-6 
      [&>ol]:mb-6 
      [&>ol>li]:mb-2
      [&>ol>li]:text-gray-700

      [&>strong]:font-bold
      [&>strong]:text-gray-900

      [&>em]:italic
      
      [&>a]:text-blue-600 
      [&>a]:underline 
      [&>a:hover]:text-blue-800

      [&>blockquote]:pl-4 
      [&>blockquote]:border-l-4 
      [&>blockquote]:border-gray-200 
      [&>blockquote]:italic
      [&>blockquote]:text-gray-600
      [&>blockquote]:my-6

      [&>img]:rounded-lg
      [&>img]:shadow-md
      [&>img]:my-4

      [&>table]:w-full
      [&>table]:border-collapse
      [&>table]:mb-6
      [&>table]:bg-white
      [&>table]:shadow-sm
      [&>table]:rounded-lg
      [&>table]:overflow-hidden
      [&>table]:border
      [&>table]:border-gray-200

      [&>table>thead]:bg-gray-50
      [&>table>thead>tr]:border-b
      [&>table>thead>tr]:border-gray-200

      [&>table>thead>tr>th]:px-6
      [&>table>thead>tr>th]:py-3
      [&>table>thead>tr>th]:text-left
      [&>table>thead>tr>th]:font-semibold
      [&>table>thead>tr>th]:text-gray-900
      [&>table>thead>tr>th]:text-sm
      [&>table>thead>tr>th]:uppercase
      [&>table>thead>tr>th]:tracking-wider

      [&>table>tbody>tr]:border-b
      [&>table>tbody>tr]:border-gray-200
      [&>table>tbody>tr]:last:border-b-0
      [&>table>tbody>tr:hover]:bg-gray-50

      [&>table>tbody>tr>td]:px-6
      [&>table>tbody>tr>td]:py-4
      [&>table>tbody>tr>td]:text-sm
      [&>table>tbody>tr>td]:text-gray-700
      [&>table>tbody>tr>td]:whitespace-normal

      [&>table>tbody>tr>td:first-child]:font-medium
      [&>table>tbody>tr>td:first-child]:text-gray-900

      [&>table>tfoot]:bg-gray-50
      [&>table>tfoot>tr]:border-t
      [&>table>tfoot>tr]:border-gray-200
      [&>table>tfoot>tr>td]:px-6
      [&>table>tfoot>tr>td]:py-3
      [&>table>tfoot>tr>td]:text-sm
      [&>table>tfoot>tr>td]:font-semibold

      [&>*:first-child]:mt-0
      [&>*:last-child]:mb-0
    `
  },

  // Specifications and features
  specs: {
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    label: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-600",
    value: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-900"
  },

  // Reviews section
  reviews: {
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    author: "font-['Montserrat'] text-sm font-medium tracking-wide text-gray-900",
    date: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-600",
    content: "font-['Montserrat'] text-base font-light tracking-wide text-gray-700"
  },

  // Related products
  related: {
    title: "font-['Montserrat'] text-2xl font-light tracking-wide text-gray-900 mb-6",
    productTitle: "font-['Montserrat'] text-base font-light tracking-wide text-gray-900",
    productPrice: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-700"
  },

  // Variant selectors
  variants: {
    label: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-700 mb-2",
    option: "font-['Montserrat'] text-sm font-light tracking-wide"
  },

  // Buttons
  button: {
    primary: "font-['Montserrat'] text-sm font-light tracking-wider uppercase",
    secondary: "font-['Montserrat'] text-sm font-light tracking-wider uppercase"
  },

  // Size chart
  sizeChart: {
    title: "font-['Montserrat'] text-xl font-light tracking-wide text-gray-900 mb-4",
    tableHeader: "font-['Montserrat'] text-sm font-medium tracking-wide text-gray-700",
    tableCell: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-600"
  },

  // FAQ section
  faq: {
    question: "font-['Montserrat'] text-base font-medium tracking-wide text-gray-900",
    answer: "font-['Montserrat'] text-base font-light tracking-wide text-gray-700"
  }
}; 