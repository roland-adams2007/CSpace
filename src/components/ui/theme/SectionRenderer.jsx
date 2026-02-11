import { SECTION_TYPES } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";

export default function SectionRenderer({ section, themeColors }) {
  const getIcon = (iconName) => {
    if (!iconName) return null;
    const IconComponent =
      LucideIcons[
        iconName
          .split("-")
          .map((word, i) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join("")
      ];
    return IconComponent || LucideIcons.Box;
  };

  const getSectionStyle = () => {
    const style = {
      paddingTop: section.style?.padding?.top || "4rem",
      paddingBottom: section.style?.padding?.bottom || "4rem",
      position: "relative",
    };

    if (section.style?.backgroundType === "color") {
      style.backgroundColor = section.style?.backgroundColor || "transparent";
    } else if (section.style?.backgroundType === "gradient") {
      style.background = section.style?.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    } else if (section.style?.backgroundType === "image" && section.style?.backgroundImage) {
      style.backgroundImage = `url(${section.style.backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }

    return style;
  };

  const getOverlayStyle = () => {
    if (section.style?.backgroundType === "image" && section.style?.backgroundImage && section.style?.backgroundOverlay > 0) {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(0, 0, 0, ${section.style.backgroundOverlay})`,
        zIndex: 1,
      };
    }
    return null;
  };

  const renderHero = () => {
    const {
      heading,
      subheading,
      ctaText,
      ctaLink,
      image,
      alignment = "center",
    } = section.props;

    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";

    if (hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={alignment === "right" ? "order-2" : ""}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {heading || "Hero Heading"}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                  {subheading || "Hero subheading goes here"}
                </p>
                {ctaText && (
                  <a
                    href={ctaLink || "#"}
                    className="inline-block px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
                  >
                    {ctaText}
                  </a>
                )}
              </div>
              <div className={alignment === "right" ? "order-1" : ""}>
                <img src={image} alt={heading} className="w-full h-auto rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-${alignment} relative z-10`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Hero Heading"}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
            {subheading || "Hero subheading goes here"}
          </p>
          {ctaText && (
            <a
              href={ctaLink || "#"}
              className="inline-block px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: themeColors?.primary || "#6366f1", color: "#ffffff" }}
            >
              {ctaText}
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    const { heading, subheading, features = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Features"}
            </h2>
            {subheading && <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>{subheading}</p>}
          </div>
          <div className={`grid grid-cols-1 ${columns >= 2 ? 'md:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-8`}>
            {features.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div key={feature.id} className="text-center p-6 rounded-xl transition-all hover:shadow-lg" style={{ backgroundColor: section.style?.backgroundType === "image" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.02)" }}>
                  {Icon && (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md" style={{ backgroundColor: themeColors?.primary || "#6366f1" }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600" style={{ color: section.style?.backgroundType === "image" ? "#d1d5db" : undefined }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCTA = () => {
    const { heading, subheading, primaryButton, secondaryButton } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            {heading || "Ready to get started?"}
          </h2>
          {subheading && <p className="text-lg md:text-xl mb-10 text-white opacity-90">{subheading}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryButton?.text && (
              <a
                href={primaryButton.link || "#"}
                className="px-8 py-4 bg-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ color: themeColors?.primary || "#6366f1" }}
              >
                {primaryButton.text}
              </a>
            )}
            {secondaryButton?.text && (
              <a
                href={secondaryButton.link || "#"}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const { heading, content, image, imagePosition = "right" } = section.props;
    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";

    if (hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={imagePosition === "left" ? "order-2" : ""}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {heading || "Content Heading"}
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>Content goes here...</p>",
                  }}
                />
              </div>
              <div className={imagePosition === "left" ? "order-1" : ""}>
                <img src={image} alt={heading} className="w-full h-auto rounded-2xl shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Content Heading"}
          </h2>
          <div
            className="prose prose-lg max-w-none"
            style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}
            dangerouslySetInnerHTML={{
              __html: content || "<p>Content goes here...</p>",
            }}
          />
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    const { heading, images = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Gallery"}
          </h2>
          <div className={`grid grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}>
            {images.length > 0
              ? images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              : Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-200 rounded-xl"
                    ></div>
                  ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonials = () => {
    const { heading, testimonials = [] } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Testimonials"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <LucideIcons.Star key={i} className="w-5 h-5 fill-current" style={{ color: themeColors?.primary || "#6366f1" }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg">"{test.content}"</p>
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-300 rounded-full mr-4 overflow-hidden">
                    {test.avatar && <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{test.name}</p>
                    <p className="text-sm text-gray-600">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPricing = () => {
    const { heading, subheading, plans = [] } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Pricing"}
            </h2>
            {subheading && <p className="text-lg md:text-xl text-gray-600" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>{subheading}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 transition-all hover:shadow-2xl ${
                  plan.highlighted
                    ? "ring-2 shadow-xl transform scale-105"
                    : "border-2 border-gray-200 bg-white"
                }`}
                style={plan.highlighted ? { borderColor: themeColors?.primary || "#6366f1", backgroundColor: "white" } : {}}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">/{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <LucideIcons.Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.ctaLink || "#"}
                  className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${
                    plan.highlighted
                      ? "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                  style={plan.highlighted ? { backgroundColor: themeColors?.primary || "#6366f1" } : {}}
                >
                  {plan.ctaText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContact = () => {
    const { heading, subheading, fields = [] } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Contact Us"}
            </h2>
            {subheading && <p className="text-lg md:text-xl text-gray-600" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>{subheading}</p>}
          </div>
          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ "--tw-ring-color": themeColors?.primary || "#6366f1" }}
                    rows="5"
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ "--tw-ring-color": themeColors?.primary || "#6366f1" }}
                  />
                )}
              </div>
            ))}
            <button
              className="w-full py-4 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: themeColors?.primary || "#6366f1" }}
            >
              {section.props.submitText || "Submit"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderTeam = () => {
    const { heading, members = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Our Team"}
          </h2>
          <div className={`grid grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-10`}>
            {members.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow">
                  {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover" />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {member.name}
                </h3>
                <p className="mb-3" style={{ color: themeColors?.primary || "#6366f1" }}>{member.role}</p>
                <p className="text-gray-600 text-sm" style={{ color: section.style?.backgroundType === "image" ? "#d1d5db" : undefined }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFAQ = () => {
    const { heading, questions = [] } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "FAQ"}
          </h2>
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {q.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  switch (section.type) {
    case SECTION_TYPES.HERO:
      return renderHero();
    case SECTION_TYPES.FEATURES:
      return renderFeatures();
    case SECTION_TYPES.CTA:
      return renderCTA();
    case SECTION_TYPES.CONTENT:
      return renderContent();
    case SECTION_TYPES.GALLERY:
      return renderGallery();
    case SECTION_TYPES.TESTIMONIALS:
      return renderTestimonials();
    case SECTION_TYPES.PRICING:
      return renderPricing();
    case SECTION_TYPES.CONTACT:
      return renderContact();
    case SECTION_TYPES.TEAM:
      return renderTeam();
    case SECTION_TYPES.FAQ:
      return renderFAQ();
    default:
      return (
        <div className="py-16 text-center text-gray-500">
          Unknown section type: {section.type}
        </div>
      );
  }
}