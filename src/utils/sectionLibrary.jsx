import { v4 as uuidv4 } from 'uuid';

export const SECTION_TYPES = {
  HERO: "hero",
  FEATURES: "features",
 CTA: "cta",
  CONTENT: "content",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  PRICING: "pricing",
  CONTACT: "contact",
  TEAM: "team",
  FAQ: "faq",
  STATS: "stats",
  NEWSLETTER: "newsletter",
  PROCESS: "process",
  BENEFITS: "benefits",
  LOGOS: "logos",
};

export const SECTION_LIBRARY = [
  {
    id: "hero-1",
    type: SECTION_TYPES.HERO,
    name: "Hero - Centered",
    icon: "layout",
    defaultProps: {
      heading: "Transform Your Digital Presence",
      subheading: "Build amazing websites in minutes with our intuitive platform",
      ctaText: "Get Started Free",
      ctaLink: "#",
      secondaryCtaText: "Watch Demo",
      secondaryCtaLink: "#demo",
      alignment: "center",
      image: "",
    },
  },
  {
    id: "hero-2",
    type: SECTION_TYPES.HERO,
    name: "Hero - Split",
    icon: "columns",
    defaultProps: {
      heading: "Build Your Dream Website",
      subheading: "Professional tools for modern creators and businesses",
      ctaText: "Start Free Trial",
      ctaLink: "#",
      secondaryCtaText: "Learn More",
      secondaryCtaLink: "#features",
      image: "",
      alignment: "left",
    },
  },
  {
    id: "hero-bold",
    type: SECTION_TYPES.HERO,
    name: "Hero - Bold",
    icon: "sparkles",
    defaultProps: {
      heading: "Make an Impact",
      subheading: "Stand out with bold design and powerful features",
      ctaText: "Get Started",
      ctaLink: "#",
      secondaryCtaText: "See Examples",
      secondaryCtaLink: "#",
      alignment: "center",
      image: "",
    },
  },
  {
    id: "hero-carousel",
    type: SECTION_TYPES.HERO,
    name: "Hero - Carousel",
    icon: "film",
    defaultProps: {
      carousel: {
        enabled: true,
        autoplay: true,
        interval: 5000,
        slides: [
          {
            id: uuidv4(),
            image: "",
            heading: "Transform Your Digital Presence",
            subheading: "Build amazing websites in minutes",
            ctaText: "Get Started",
            ctaLink: "#"
          },
          {
            id: uuidv4(),
            image: "",
            heading: "Powerful Features",
            subheading: "Everything you need to succeed online",
            ctaText: "Learn More",
            ctaLink: "#"
          },
          {
            id: uuidv4(),
            image: "",
            heading: "Join Thousands",
            subheading: "Trusted by creators worldwide",
            ctaText: "Start Free Trial",
            ctaLink: "#"
          }
        ]
      }
    },
  },
  {
    id: "features-grid",
    type: SECTION_TYPES.FEATURES,
    name: "Features - Grid",
    icon: "grid",
    defaultProps: {
      heading: "Everything You Need",
      subheading: "Powerful features to help you succeed",
      features: [
        {
          id: uuidv4(),
          icon: "zap",
          title: "Lightning Fast",
          description: "Optimized for speed with instant load times",
        },
        {
          id: uuidv4(),
          icon: "shield",
          title: "Secure & Safe",
          description: "Enterprise-grade security built-in",
        },
        {
          id: uuidv4(),
          icon: "smartphone",
          title: "Mobile Ready",
          description: "Perfect on every device and screen size",
        },
        {
          id: uuidv4(),
          icon: "globe",
          title: "Global CDN",
          description: "Fast delivery worldwide",
        },
        {
          id: uuidv4(),
          icon: "code",
          title: "Developer Friendly",
          description: "Custom code when you need it",
        },
        {
          id: uuidv4(),
          icon: "trending-up",
          title: "SEO Optimized",
          description: "Rank higher in search results",
        },
      ],
      columns: 3,
    },
  },
  {
    id: "features-list",
    type: SECTION_TYPES.FEATURES,
    name: "Features - List",
    icon: "list",
    defaultProps: {
      heading: "Why Choose Us",
      subheading: "Built for success from day one",
      features: [
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Easy to Use",
          description: "Intuitive interface designed for everyone",
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Powerful Tools",
          description: "Advanced features when you need them",
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Flexible Design",
          description: "Customize every aspect of your site",
        },
      ],
      columns: 2,
    },
  },
  {
    id: "stats-row",
    type: SECTION_TYPES.STATS,
    name: "Stats - Row",
    icon: "bar-chart",
    defaultProps: {
      heading: "Our Impact",
      subheading: "Numbers speak louder than words",
      stats: [
        {
          id: uuidv4(),
          value: "100K+",
          label: "Active Users",
          description: "Worldwide",
        },
        {
          id: uuidv4(),
          value: "99.9%",
          label: "Uptime",
          description: "Guaranteed",
        },
        {
          id: uuidv4(),
          value: "4.9/5",
          label: "Rating",
          description: "Customer satisfaction",
        },
        {
          id: uuidv4(),
          value: "24/7",
          label: "Support",
          description: "Always available",
        },
      ],
    },
  },
  {
    id: "stats-grid",
    type: SECTION_TYPES.STATS,
    name: "Stats - With Headline",
    icon: "trending-up",
    defaultProps: {
      heading: "Trusted by teams worldwide",
      subheading: "Join thousands of companies using our platform",
      stats: [
        {
          id: uuidv4(),
          value: "10B+",
          label: "Requests",
          description: "Processed monthly",
        },
        {
          id: uuidv4(),
          value: "98%",
          label: "Satisfaction",
          description: "Customer happiness",
        },
        {
          id: uuidv4(),
          value: "24/7",
          label: "Support",
          description: "Dedicated team",
        },
      ],
    },
  },
  {
    id: "cta-simple",
    type: SECTION_TYPES.CTA,
    name: "Call to Action - Simple",
    icon: "mouse-pointer",
    defaultProps: {
      heading: "Ready to Get Started?",
      subheading: "Join thousands of satisfied customers today",
      primaryButton: {
        text: "Start Free Trial",
        link: "#",
      },
      secondaryButton: {
        text: "Contact Sales",
        link: "#",
      },
    },
  },
  {
    id: "cta-features",
    type: SECTION_TYPES.CTA,
    name: "Call to Action - With Features",
    icon: "zap",
    defaultProps: {
      heading: "Start Building Today",
      subheading: "Everything you need to succeed online",
      primaryButton: {
        text: "Get Started Free",
        link: "#",
      },
      secondaryButton: {
        text: "Learn More",
        link: "#",
      },
      features: [
        "No credit card required",
        "14-day free trial",
        "Cancel anytime",
      ],
    },
  },
  {
    id: "content-text",
    type: SECTION_TYPES.CONTENT,
    name: "Content - Text Only",
    icon: "file-text",
    defaultProps: {
      heading: "Our Story",
      content: "<p>We believe in building tools that empower everyone to create amazing websites. Our platform combines simplicity with powerful features.</p><p>Join thousands of creators who have already transformed their online presence with our platform.</p>",
      alignment: "left",
    },
  },
  {
    id: "content-image",
    type: SECTION_TYPES.CONTENT,
    name: "Content - With Image",
    icon: "image",
    defaultProps: {
      heading: "Built for Creators",
      content: "<p>We believe that everyone deserves access to professional web tools. Our platform combines simplicity with power.</p><p>From portfolios to online stores, we've got you covered with everything you need to succeed online.</p>",
      image: "",
      imagePosition: "right",
    },
  },
  {
    id: "gallery-grid",
    type: SECTION_TYPES.GALLERY,
    name: "Gallery - Grid",
    icon: "grid",
    defaultProps: {
      heading: "Our Work",
      subheading: "Explore our latest projects",
      items: [
        {
          id: uuidv4(),
          image: "",
          title: "Project Alpha",
          category: "Design",
          description: "A modern web design project"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Project Beta",
          category: "Development",
          description: "Custom web application"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Project Gamma",
          category: "Branding",
          description: "Complete brand identity"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Project Delta",
          category: "Marketing",
          description: "Digital marketing campaign"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Project Epsilon",
          category: "E-commerce",
          description: "Online store platform"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Project Zeta",
          category: "Mobile",
          description: "Cross-platform app"
        }
      ],
      columns: 3,
    },
  },
  {
    id: "gallery-masonry",
    type: SECTION_TYPES.GALLERY,
    name: "Gallery - Masonry",
    icon: "layout",
    defaultProps: {
      heading: "Portfolio",
      subheading: "Showcasing creative excellence",
      items: [
        { id: uuidv4(), image: "", title: "Project Alpha", category: "Design" },
        { id: uuidv4(), image: "", title: "Project Beta", category: "Development" },
        { id: uuidv4(), image: "", title: "Project Gamma", category: "Branding" },
      ],
      columns: 3,
    },
  },
  {
    id: "gallery-carousel",
    type: SECTION_TYPES.GALLERY,
    name: "Gallery - Carousel",
    icon: "film",
    defaultProps: {
      heading: "Featured Projects",
      subheading: "A showcase of our best work",
      items: [
        {
          id: uuidv4(),
          image: "",
          title: "Featured Project 1",
          category: "Design",
          description: "Complete brand redesign"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Featured Project 2",
          category: "Development",
          description: "Custom platform"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Featured Project 3",
          category: "Strategy",
          description: "Digital transformation"
        },
        {
          id: uuidv4(),
          image: "",
          title: "Featured Project 4",
          category: "Marketing",
          description: "Campaign strategy"
        }
      ],
      columns: 1,
      carousel: {
        enabled: true,
        autoplay: true,
        interval: 5000
      }
    },
  },
  {
    id: "testimonials-grid",
    type: SECTION_TYPES.TESTIMONIALS,
    name: "Testimonials - Grid",
    icon: "message-square",
    defaultProps: {
      heading: "What Our Customers Say",
      subheading: "Real feedback from real people",
      testimonials: [
        {
          id: uuidv4(),
          name: "Sarah Mitchell",
          role: "Creative Director",
          content: "This platform transformed how we build websites. The flexibility and ease of use are unmatched.",
          avatar: "",
          rating: 5,
        },
        {
          id: uuidv4(),
          name: "James Chen",
          role: "Startup Founder",
          content: "Finally, a website builder that doesn't limit creativity. Highly recommended!",
          avatar: "",
          rating: 5,
        },
        {
          id: uuidv4(),
          name: "Emily Rodriguez",
          role: "Marketing Manager",
          content: "The ROI has been incredible. We launched in days and saw immediate results.",
          avatar: "",
          rating: 5,
        },
      ],
    },
  },
  {
    id: "testimonials-showcase",
    type: SECTION_TYPES.TESTIMONIALS,
    name: "Testimonials - Showcase",
    icon: "star",
    defaultProps: {
      heading: "Success Stories",
      subheading: "See what our clients have achieved",
      testimonials: [
        {
          id: uuidv4(),
          name: "Emily Rodriguez",
          role: "Marketing Manager",
          content: "The ROI has been incredible. We launched in days and saw immediate results.",
          avatar: "",
          rating: 5,
          metric: "300% increase"
        },
      ],
    },
  },
  {
    id: "testimonials-carousel",
    type: SECTION_TYPES.TESTIMONIALS,
    name: "Testimonials - Carousel",
    icon: "film",
    defaultProps: {
      heading: "Success Stories",
      subheading: "See what our clients have achieved",
      testimonials: [
        {
          id: uuidv4(),
          name: "Emily Rodriguez",
          role: "Marketing Manager",
          content: "The ROI has been incredible. We launched in days and saw immediate results.",
          avatar: "",
          rating: 5,
          metric: "300% increase"
        },
        {
          id: uuidv4(),
          name: "David Kim",
          role: "E-commerce Owner",
          content: "Sales doubled within the first month. The platform is incredibly powerful yet easy to use.",
          avatar: "",
          rating: 5,
          metric: "2x revenue"
        },
        {
          id: uuidv4(),
          name: "Lisa Wang",
          role: "Product Designer",
          content: "Finally, a tool that understands both designers and developers. Pure joy to use.",
          avatar: "",
          rating: 5,
          metric: "10+ projects"
        }
      ],
      carousel: {
        enabled: true,
        autoplay: true,
        interval: 5000
      }
    },
  },
  {
    id: "pricing-table",
    type: SECTION_TYPES.PRICING,
    name: "Pricing - Table",
    icon: "dollar-sign",
    defaultProps: {
      heading: "Choose Your Plan",
      subheading: "Flexible pricing that grows with you",
      plans: [
        {
          id: uuidv4(),
          name: "Starter",
          price: "$12",
          period: "month",
          description: "Perfect for individuals",
          features: [
            "5 Projects",
            "10GB Storage",
            "Basic Support",
          ],
          ctaText: "Get Started",
          ctaLink: "#",
          highlighted: false,
        },
        {
          id: uuidv4(),
          name: "Pro",
          price: "$39",
          period: "month",
          description: "For professionals",
          features: [
            "Unlimited Projects",
            "100GB Storage",
            "Priority Support",
            "Advanced Features",
          ],
          ctaText: "Start Trial",
          ctaLink: "#",
          highlighted: true,
          badge: "Most Popular",
        },
        {
          id: uuidv4(),
          name: "Enterprise",
          price: "Custom",
          period: "",
          description: "For large teams",
          features: [
            "Everything in Pro",
            "Unlimited Storage",
            "Dedicated Support",
            "Custom Features",
          ],
          ctaText: "Contact Us",
          ctaLink: "#",
          highlighted: false,
        },
      ],
    },
  },
  {
    id: "contact-form",
    type: SECTION_TYPES.CONTACT,
    name: "Contact Form",
    icon: "mail",
    defaultProps: {
      heading: "Get In Touch",
      subheading: "We'd love to hear from you",
      fields: [
        { id: uuidv4(), type: "text", label: "Name", required: true },
        { id: uuidv4(), type: "email", label: "Email", required: true },
        { id: uuidv4(), type: "textarea", label: "Message", required: true },
      ],
      submitText: "Send Message",
    },
  },
  {
    id: "team-grid",
    type: SECTION_TYPES.TEAM,
    name: "Team - Grid",
    icon: "users",
    defaultProps: {
      heading: "Meet Our Team",
      subheading: "The people behind the product",
      members: [
        {
          id: uuidv4(),
          name: "Olivia Chen",
          role: "Creative Director",
          bio: "Leading design with passion and precision",
          image: "",
          socials: {},
        },
        {
          id: uuidv4(),
          name: "Marcus Thompson",
          role: "Head of Product",
          bio: "Building tools that empower creators",
          image: "",
          socials: {},
        },
        {
          id: uuidv4(),
          name: "Yuki Tanaka",
          role: "Lead Engineer",
          bio: "Crafting elegant technical solutions",
          image: "",
          socials: {},
        },
      ],
      columns: 3,
    },
  },
  {
    id: "faq-accordion",
    type: SECTION_TYPES.FAQ,
    name: "FAQ - Accordion",
    icon: "help-circle",
    defaultProps: {
      heading: "Frequently Asked Questions",
      subheading: "Everything you need to know",
      faqs: [
        {
          id: uuidv4(),
          question: "Do I need coding knowledge?",
          answer: "Not at all! Our platform is designed for everyone, from complete beginners to experienced developers.",
        },
        {
          id: uuidv4(),
          question: "Can I use my own domain?",
          answer: "Yes! You can connect any domain you own or purchase a new one directly through our platform.",
        },
        {
          id: uuidv4(),
          question: "What kind of websites can I build?",
          answer: "Anything you can imagine! From portfolios and blogs to online stores and business sites.",
        },
      ],
    },
  },
  {
    id: "newsletter-simple",
    type: SECTION_TYPES.NEWSLETTER,
    name: "Newsletter",
    icon: "mail",
    defaultProps: {
      heading: "Stay Updated",
      subheading: "Get the latest news and updates delivered to your inbox",
      placeholder: "Enter your email",
      buttonText: "Subscribe",
      benefits: [
        "Weekly insights",
        "Exclusive content",
        "Early access",
      ],
    },
  },
  {
    id: "process-timeline",
    type: SECTION_TYPES.PROCESS,
    name: "Process - Timeline",
    icon: "clock",
    defaultProps: {
      heading: "How It Works",
      subheading: "Simple steps to get started",
      steps: [
        {
          id: uuidv4(),
          icon: "edit",
          title: "Plan",
          description: "Define your goals and requirements",
          duration: "1-2 days"
        },
        {
          id: uuidv4(),
          icon: "code",
          title: "Build",
          description: "Create your website with our tools",
          duration: "3-5 days"
        },
        {
          id: uuidv4(),
          icon: "rocket",
          title: "Launch",
          description: "Deploy and go live instantly",
          duration: "Same day"
        }
      ]
    },
  },
  {
    id: "process-grid",
    type: SECTION_TYPES.PROCESS,
    name: "Process - Grid",
    icon: "grid",
    defaultProps: {
      heading: "Our Approach",
      subheading: "How we deliver results",
      steps: [
        {
          id: uuidv4(),
          icon: "search",
          title: "Discovery",
          description: "Understanding your needs",
          number: "01"
        },
        {
          id: uuidv4(),
          icon: "pen-tool",
          title: "Design",
          description: "Creating the perfect look",
          number: "02"
        },
        {
          id: uuidv4(),
          icon: "code",
          title: "Development",
          description: "Building your solution",
          number: "03"
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Quality",
          description: "Testing and optimization",
          number: "04"
        }
      ]
    },
  },
  {
    id: "benefits-grid",
    type: SECTION_TYPES.BENEFITS,
    name: "Benefits - Grid",
    icon: "award",
    defaultProps: {
      heading: "Why Choose Us",
      subheading: "The advantages of working with us",
      benefits: [
        {
          id: uuidv4(),
          icon: "zap",
          title: "Lightning Fast",
          description: "10x faster performance",
          metric: "99.9%"
        },
        {
          id: uuidv4(),
          icon: "shield",
          title: "Bank Level Security",
          description: "Enterprise encryption",
          metric: "256-bit"
        },
        {
          id: uuidv4(),
          icon: "headphones",
          title: "24/7 Support",
          description: "Always here to help",
          metric: "< 5min"
        },
        {
          id: uuidv4(),
          icon: "trending-up",
          title: "Proven Results",
          description: "Average 3x ROI",
          metric: "+300%"
        }
      ]
    },
  },
  {
    id: "benefits-list",
    type: SECTION_TYPES.BENEFITS,
    name: "Benefits - List",
    icon: "list",
    defaultProps: {
      heading: "Everything Included",
      subheading: "No hidden fees or surprises",
      benefits: [
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Unlimited Pages",
          description: "Create as many pages as you need"
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Custom Domain",
          description: "Use your own domain name"
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "SSL Certificate",
          description: "Free SSL for all sites"
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Daily Backups",
          description: "Automatic backup system"
        },
        {
          id: uuidv4(),
          icon: "check-circle",
          title: "Analytics",
          description: "Built-in traffic tracking"
        }
      ]
    },
  },
  {
    id: "logos-grid",
    type: SECTION_TYPES.LOGOS,
    name: "Logos - Grid",
    icon: "grid",
    defaultProps: {
      heading: "Trusted by Industry Leaders",
      subheading: "Join thousands of companies using our platform",
      logos: [
        { id: uuidv4(), image: "", name: "Company 1", width: "120" },
        { id: uuidv4(), image: "", name: "Company 2", width: "120" },
        { id: uuidv4(), image: "", name: "Company 3", width: "120" },
        { id: uuidv4(), image: "", name: "Company 4", width: "120" },
        { id: uuidv4(), image: "", name: "Company 5", width: "120" },
        { id: uuidv4(), image: "", name: "Company 6", width: "120" }
      ],
      columns: 4
    },
  },
  {
    id: "logos-carousel",
    type: SECTION_TYPES.LOGOS,
    name: "Logos - Carousel",
    icon: "film",
    defaultProps: {
      heading: "Trusted by the best",
      subheading: "Companies that rely on us",
      logos: [
        { id: uuidv4(), image: "", name: "Partner 1" },
        { id: uuidv4(), image: "", name: "Partner 2" },
        { id: uuidv4(), image: "", name: "Partner 3" },
        { id: uuidv4(), image: "", name: "Partner 4" },
        { id: uuidv4(), image: "", name: "Partner 5" },
        { id: uuidv4(), image: "", name: "Partner 6" },
        { id: uuidv4(), image: "", name: "Partner 7" },
        { id: uuidv4(), image: "", name: "Partner 8" }
      ],
      carousel: {
        enabled: true,
        autoplay: true,
        interval: 3000
      }
    },
  },
];

export const createNewSection = (libraryItem) => {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: libraryItem.type,
    templateId: libraryItem.id,
    props: JSON.parse(JSON.stringify(libraryItem.defaultProps)),
    style: {
      padding: {
        top: "4rem",
        bottom: "4rem",
      },
      backgroundType: "color",
      backgroundColor: "transparent",
      backgroundGradient: "",
      backgroundImage: "",
      backgroundOverlay: 0,
    },
  };
};