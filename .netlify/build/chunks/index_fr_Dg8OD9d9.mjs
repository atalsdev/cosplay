const sections = [
	{
		type: "welcomeSection",
		title: "Alimentez Votre Passion : Libérez la Route avec MotoPlanet",
		description: "Plongez dans l'univers de la moto avec MotoPlanet - votre destination unique pour les actualités, les tests, les guides d'équipement et l'inspiration. Prenez la route en toute confiance - commencez à explorer dès aujourd'hui !",
		blogLinkText: "Lire les Dernières Actualités Moto",
		blogLink: "/blog"
	},
	{
		type: "bannerSection",
		headline: "Découvrez Votre Moto Parfaite",
		description: "Tests d'experts, guides d'achat et conseils d'entretien - tout ce dont vous avez besoin pour prendre des décisions éclairées dans votre aventure moto.",
		backgroundImage: "/images/banner-bg.jpg",
		button1Text: "Parcourir les Tests",
		button1Link: "/reviews",
		button2Text: "Lire les Guides",
		button2Link: "/guides"
	},
	{
		type: "categoryGrid",
		title: "Acheter par Catégorie",
		description: "Trouvez l'équipement parfait pour votre style de conduite",
		categories: [
			{
				id: "helmets",
				name: "Casques",
				description: "Protection premium pour chaque motard",
				image: "/images/categories/helmets.jpg",
				link: "/shop/helmets"
			},
			{
				id: "jackets",
				name: "Blousons",
				description: "Sécurité et style sur la route",
				image: "/images/categories/jackets.jpg",
				link: "/shop/jackets"
			},
			{
				id: "boots",
				name: "Bottes",
				description: "Chaussures fiables pour chaque voyage",
				image: "/images/categories/boots.jpg",
				link: "/shop/boots"
			}
		]
	},
	{
		type: "productShowcase",
		title: "Produits Vedettes",
		description: "Notre équipement moto le plus populaire",
		viewAllLink: "/shop",
		products: [
			{
				id: "helmet-1",
				name: "Casque de Course X-1 Pro",
				description: "Protection de qualité professionnelle",
				price: "599,99 €",
				image: "/images/products/helmet-1.jpg",
				category: "Casques"
			},
			{
				id: "jacket-1",
				name: "Blouson de Course en Cuir",
				description: "Protection en cuir premium",
				price: "399,99 €",
				image: "/images/products/jacket-1.jpg",
				category: "Blousons"
			},
			{
				id: "boots-1",
				name: "Bottes Adventure",
				description: "Confort tout-terrain",
				price: "299,99 €",
				image: "/images/products/boots-1.jpg",
				category: "Bottes"
			},
			{
				id: "gloves-1",
				name: "Gants de Course Pro",
				description: "Adhérence et protection maximales",
				price: "89,99 €",
				image: "/images/products/gloves-1.jpg",
				category: "Gants"
			}
		]
	},
	{
		type: "testimonialSlider",
		title: "Ce que Disent Nos Motards",
		testimonials: [
			{
				id: "1",
				author: "Jean Motard",
				role: "Pilote Professionnel",
				content: "La qualité de l'équipement RidWear est inégalée. J'utilise leurs produits depuis des années et ils ne déçoivent jamais.",
				avatar: "/images/testimonials/john.jpg"
			},
			{
				id: "2",
				author: "Sophie Martin",
				role: "Motarde Aventurière",
				content: "J'ai trouvé mon équipement d'aventure parfait ici. Le service client est exceptionnel et les produits sont de première qualité.",
				avatar: "/images/testimonials/sarah.jpg"
			},
			{
				id: "3",
				author: "Michel Chen",
				role: "Navetteur Quotidien",
				content: "Excellente sélection d'équipements confortables et protecteurs pour la conduite quotidienne. Je recommande vivement !",
				avatar: "/images/testimonials/mike.jpg"
			}
		]
	},
	{
		type: "featuredPostsSection",
		title: "Derniers Articles du Blog",
		exploreMoreText: "Voir Tous les Articles",
		exploreMoreLink: "/blog"
	},
	{
		type: "emailSignupSection",
		title: "Restez Informé",
		description: "Abonnez-vous à notre newsletter pour recevoir les dernières actualités moto, tests d'équipement et offres exclusives.",
		backgroundImage: "/images/newsletter-bg.jpg",
		formAction: "/api/subscribe",
		submitText: "S'abonner Maintenant"
	}
];
const index_fr = {
	sections: sections
};

export { index_fr as default, sections };
