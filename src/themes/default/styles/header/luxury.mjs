export const luxuryHeaderStyle = {
  wrapper: "bg-white shadow-sm sticky top-0 z-[100]",
  container: "max-w-7xl mx-auto px-4",
  nav: {
    wrapper: "flex items-center justify-between h-16",
    brand: "font-['Montserrat'] text-2xl font-light tracking-wide",
    menu: {
      wrapper: "hidden md:flex space-x-8",
      item: "font-['Montserrat'] text-sm font-light tracking-wide text-gray-700 hover:text-black"
    }
  },
  actions: {
    wrapper: "flex items-center space-x-4",
    currency: {
      button: "flex items-center space-x-2 text-gray-700 hover:text-black",
      text: "font-['Montserrat'] text-sm font-light",
      dropdown: "absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50",
      option: "block w-full text-left px-4 py-2 text-sm font-['Montserrat'] font-light"
    },
    language: {
      button: "flex items-center space-x-2 text-gray-700 hover:text-black",
      text: "font-['Montserrat'] text-sm font-light",
      dropdown: "absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50",
      option: "block w-full text-left px-4 py-2 text-sm font-['Montserrat'] font-light"
    },
    cart: {
      button: "text-gray-700 hover:text-black relative",
      count: "absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-['Montserrat']",
      drawer: "fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[200]",
      header: "p-4 border-b",
      title: "font-['Montserrat'] text-xl font-light tracking-wide",
      closeButton: "text-gray-500 hover:text-gray-700"
    }
  },
  overlay: "fixed inset-0 bg-black bg-opacity-50 z-[150]"
}; 