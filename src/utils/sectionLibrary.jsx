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
};

export const SECTION_LIBRARY = [
  {
    id: "hero-1",
    type: SECTION_TYPES.HERO,
    name: "Hero - Centered",
    icon: "layout",
    defaultProps: {
      heading: "Welcome to Our Platform",
      subheading: "Build amazing websites in minutes",
      ctaText: "Get Started",
      ctaLink: "#",
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
      subheading: "Professional tools for modern creators",
      ctaText: "Start Free Trial",
      ctaLink: "#",
      image: "",
      alignment: "left",
    },
  },
  {
    id: "features-grid",
    type: SECTION_TYPES.FEATURES,
    name: "Features - Grid",
    icon: "grid",
    defaultProps: {
      heading: "Our Features",
      subheading: "Everything you need to succeed",
      features: [
        {
          id: "f1",
          icon: "zap",
          title: "Fast Performance",
          description: "Lightning-fast load times",
        },
        {
          id: "f2",
          icon: "shield",
          title: "Secure",
          description: "Enterprise-grade security",
        },
        {
          id: "f3",
          icon: "smartphone",
          title: "Responsive",
          description: "Works on all devices",
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
      features: [
        {
          id: "f1",
          icon: "check-circle",
          title: "Easy to Use",
          description: "Intuitive interface designed for everyone",
        },
        {
          id: "f2",
          icon: "check-circle",
          title: "Powerful",
          description: "Advanced features when you need them",
        },
      ],
      columns: 2,
    },
  },
  {
    id: "cta-simple",
    type: SECTION_TYPES.CTA,
    name: "Call to Action",
    icon: "mouse-pointer",
    defaultProps: {
      heading: "Ready to Get Started?",
      subheading: "Join thousands of satisfied customers",
      primaryButton: {
        text: "Start Now",
        link: "#",
      },
      secondaryButton: {
        text: "Learn More",
        link: "#",
      },
      background: "gradient",
    },
  },
  {
    id: "content-text",
    type: SECTION_TYPES.CONTENT,
    name: "Content - Text",
    icon: "file-text",
    defaultProps: {
      heading: "About Us",
      content: "<p>Your content goes here...</p>",
      alignment: "left",
      image: "",
      imagePosition: "right",
    },
  },
  {
    id: "content-image",
    type: SECTION_TYPES.CONTENT,
    name: "Content - Image & Text",
    icon: "image",
    defaultProps: {
      heading: "Our Story",
      content: "<p>Your content goes here...</p>",
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
      heading: "Gallery",
      images: [],
      columns: 3,
      spacing: "md",
    },
  },
  {
    id: "testimonials-slider",
    type: SECTION_TYPES.TESTIMONIALS,
    name: "Testimonials",
    icon: "message-square",
    defaultProps: {
      heading: "What Our Customers Say",
      testimonials: [
        {
          id: "t1",
          name: "John Doe",
          role: "CEO, Company",
          content: "Amazing product! Highly recommended.",
          avatar: "",
          rating: 5,
        },
      ],
    },
  },
  {
    id: "pricing-table",
    type: SECTION_TYPES.PRICING,
    name: "Pricing Table",
    icon: "dollar-sign",
    defaultProps: {
      heading: "Choose Your Plan",
      subheading: "Flexible pricing for every need",
      plans: [
        {
          id: "p1",
          name: "Basic",
          price: "$9",
          period: "month",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          ctaText: "Get Started",
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
        { id: "name", type: "text", label: "Name", required: true },
        { id: "email", type: "email", label: "Email", required: true },
        { id: "message", type: "textarea", label: "Message", required: true },
      ],
      submitText: "Send Message",
    },
  },
  {
    id: "team-grid",
    type: SECTION_TYPES.TEAM,
    name: "Team Members",
    icon: "users",
    defaultProps: {
      heading: "Meet Our Team",
      members: [
        {
          id: "m1",
          name: "Team Member",
          role: "Position",
          bio: "Short bio here",
          image: "",
          social: [],
        },
      ],
      columns: 3,
    },
  },
  {
    id: "faq-accordion",
    type: SECTION_TYPES.FAQ,
    name: "FAQ",
    icon: "help-circle",
    defaultProps: {
      heading: "Frequently Asked Questions",
      questions: [
        {
          id: "q1",
          question: "Sample question?",
          answer: "Sample answer goes here.",
        },
      ],
    },
  },
];

export const createNewSection = (libraryItem) => {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: libraryItem.type,
    templateId: libraryItem.id,
    props: { ...libraryItem.defaultProps },
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