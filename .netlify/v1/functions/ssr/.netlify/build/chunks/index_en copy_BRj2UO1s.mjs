const sections = [
	{
		type: "welcomeSection",
		title: "Fuel Your Passion: Unleash the Ride with MotoPlanet",
		description: "Dive into the world of motorcycling with MotoPlanet - your one-stop shop for news, reviews, gear guides, and inspiration. Hit the road with confidence - start exploring today!",
		blogLinkText: "Read the Latest Motorcycle News",
		blogLink: "/blog"
	},
	{
		type: "bannerSection",
		headline: "Discover Your Perfect Ride",
		description: "Expert reviews, buying guides, and maintenance tips - everything you need to make informed decisions about your motorcycle journey.",
		backgroundImage: "/images/banner-bg.jpg",
		button1Text: "Browse Reviews",
		button1Link: "/reviews",
		button2Text: "Read Guides",
		button2Link: "/guides"
	},
	{
		type: "featuredPostsSection",
		title: "Latest From The Blog",
		exploreMoreText: "View All Posts",
		exploreMoreLink: "/blog"
	},
	{
		type: "emailSignupSection",
		title: "Stay in the Loop",
		description: "Subscribe to our newsletter for the latest motorcycle news, gear reviews, and exclusive offers.",
		backgroundImage: "/images/newsletter-bg.jpg",
		formAction: "/api/subscribe",
		submitText: "Subscribe Now"
	}
];
const index_en_copy = {
	sections: sections
};

export { index_en_copy as default, sections };
