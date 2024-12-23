const sections = [
	{
		type: "welcomeSection",
		title: "Welcome to Your Ultimate Motorcycle Store",
		description: "Explore high-quality motorcycle gear, accessories, and advice to fuel your passion for the open road.",
		blogLinkText: "Read Our Blog",
		blogLink: "/blog"
	},
	{
		type: "bannerSection",
		headline: "Gear Up for Your Next Adventure",
		description: "Discover our top-rated helmets, jackets, and accessories to stay safe and stylish on the road.",
		backgroundImage: "/images/banner-motorcycle-bg.jpg",
		button1Text: "Shop Gear",
		button1Link: "/shop",
		button2Text: "Learn More",
		button2Link: "/about"
	},
	{
		type: "categoryGrid",
		title: "Shop by Category",
		description: "Find gear that suits your ride style and needs, from helmets and jackets to gloves and boots.",
		categories: [
			{
				id: "helmets",
				name: "Helmets",
				description: "DOT-approved helmets for maximum safety.",
				image: "https://source.unsplash.com/random/800x600/?bike",
				link: "/helmets"
			},
			{
				id: "jackets",
				name: "Jackets",
				description: "Protective and stylish motorcycle jackets.",
				image: "https://source.unsplash.com/random/800x600/?bike",
				link: "/jackets"
			},
			{
				id: "gloves",
				name: "Gloves",
				description: "Durable gloves for better grip and control.",
				image: "https://source.unsplash.com/random/800x600/?bike",
				link: "/gloves"
			}
		]
	},
	{
		type: "productShowcase",
		title: "Featured Products",
		description: "Check out our best-selling gear and accessories chosen by riders.",
		viewAllLink: "/products",
		products: [
			{
				id: "helmet-1",
				name: "Full-Face Helmet",
				description: "Ultimate protection with advanced ventilation.",
				price: "199.99",
				image: "/images/products/helmet-1.jpg",
				category: "Helmets"
			},
			{
				id: "jacket-1",
				name: "Leather Jacket",
				description: "Stylish and durable with armor inserts.",
				price: "249.99",
				image: "/images/products/jacket-1.jpg",
				category: "Jackets"
			}
		]
	},
	{
		type: "testimonialSlider",
		title: "Rider Testimonials",
		testimonials: [
			{
				id: "1",
				author: "Alex Thompson",
				role: "Adventure Rider",
				content: "The gear here is top-notch. I've never felt safer on my bike.",
				avatar: "/images/testimonials/avatar-1.jpg"
			}
		]
	},
	{
		type: "faqSection",
		title: "Frequently Asked Questions",
		description: "Find answers to your questions about motorcycle gear, safety, and maintenance.",
		faqs: [
			{
				question: "What type of motorcycle is best for beginners?",
				answer: "For beginners, we recommend a lightweight motorcycle (250-400cc) for an optimal balance of power and control."
			},
			{
				question: "How do I choose the right helmet?",
				answer: "Choose a DOT-certified helmet that fits snugly. Consider helmet type, ventilation, and visibility."
			},
			{
				question: "What safety gear is essential for riding?",
				answer: "Essentials include a DOT-approved helmet, armored jacket, gloves, and sturdy boots for full protection."
			}
		]
	},
	{
		type: "emailSignupSection",
		title: "Stay Updated on Motorcycle Gear and Tips",
		description: "Sign up for our newsletter to get the latest product updates, tips, and exclusive offers.",
		backgroundImage: "/images/newsletter-motorcycle-bg.jpg",
		formAction: "/api/subscribe",
		submitText: "Subscribe"
	}
];
const index_en = {
	sections: sections
};

export { index_en as default, sections };
