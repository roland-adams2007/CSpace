import { SECTION_TYPES } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";

export default function SectionRenderer({ section, themeColors, selectedTemplate }) {
  const getIcon = (iconName) => {
    if (!iconName) return null;
    const IconComponent = LucideIcons[
      iconName.split("-").map((word, i) =>
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join("")
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

    if (selectedTemplate === "minimal") {
      style.maxWidth = "900px";
      style.marginLeft = "auto";
      style.marginRight = "auto";
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
    const { heading, subheading, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, image, alignment = "center" } = section.props;
    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";
    const primaryColor = themeColors?.primary || "#6366f1";

    if (selectedTemplate === "bold") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
              ✨ New & Improved
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
              {heading || "Hero Heading"}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto font-medium">
              {subheading || "Hero subheading goes here"}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {ctaText && (
                <a href={ctaLink || "#"} className="group relative px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
                  <span className="relative z-10">{ctaText}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
              )}
              {secondaryCtaText && (
                <a href={secondaryCtaLink || "#"} className="px-10 py-5 border-3 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all">
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate === "modern" && hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 order-2 lg:order-1">
                <div>
                  <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-100 rounded-full text-indigo-600 text-sm font-semibold">
                    🚀 Featured
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900">
                    {heading || "Hero Heading"}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    {subheading || "Hero subheading goes here"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {ctaText && (
                    <a href={ctaLink || "#"} className="group px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
                      <span className="relative z-10 text-white">{ctaText}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </a>
                  )}
                  {secondaryCtaText && (
                    <a href={secondaryCtaLink || "#"} className="px-10 py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-all">
                      {secondaryCtaText}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-4 border-white"></div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">100K+ Users</div>
                    <div className="text-gray-600">Join our community</div>
                  </div>
                </div>
              </div>
              <div className="relative order-1 lg:order-2">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
                <img src={image} alt={heading} className="relative w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-3xl opacity-50" style={{ backgroundColor: primaryColor }}></div>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-3xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate === "minimal") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-10 tracking-tight leading-tight">
              {heading || "Hero Heading"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
              {subheading || "Hero subheading goes here"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {ctaText && (
                <a href={ctaLink || "#"} className="px-10 py-4 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-all">
                  {ctaText}
                </a>
              )}
              {secondaryCtaText && (
                <a href={secondaryCtaLink || "#"} className="px-10 py-4 text-gray-600 hover:text-gray-900 font-medium group inline-flex items-center gap-2">
                  {secondaryCtaText}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={alignment === "right" ? "lg:order-2" : ""}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {heading || "Hero Heading"}
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                  {subheading || "Hero subheading goes here"}
                </p>
                <div className="flex flex-wrap gap-4">
                  {ctaText && (
                    <a href={ctaLink || "#"} className="inline-block px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1" style={{ backgroundColor: primaryColor, color: "#ffffff" }}>
                      {ctaText}
                    </a>
                  )}
                  {secondaryCtaText && (
                    <a href={secondaryCtaLink || "#"} className="inline-block px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold hover:bg-gray-900 hover:text-white transition-all">
                      {secondaryCtaText}
                    </a>
                  )}
                </div>
              </div>
              <div className={alignment === "right" ? "lg:order-1" : ""}>
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
        <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-${alignment} relative z-10`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-8 leading-tight" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Hero Heading"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
            {subheading || "Hero subheading goes here"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {ctaText && (
              <a href={ctaLink || "#"} className="inline-block px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1" style={{ backgroundColor: primaryColor, color: "#ffffff" }}>
                {ctaText}
              </a>
            )}
            {secondaryCtaText && (
              <a href={secondaryCtaLink || "#"} className="inline-block px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    const { heading, subheading, features = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();
    const primaryColor = themeColors?.primary || "#6366f1";

    if (selectedTemplate === "bold") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                {heading || "Features"}
              </h2>
              {subheading && (
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  {subheading}
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} gap-8`}>
              {features.map((feature) => {
                const Icon = getIcon(feature.icon);
                const colors = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#a8e6cf", "#ff8b94", "#b4a7d6"];
                const bgColor = feature.color || colors[Math.floor(Math.random() * colors.length)];
                return (
                  <div key={feature.id} className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-4 border-transparent hover:border-current" style={{ borderColor: bgColor }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: bgColor }}></div>
                    <div className="relative">
                      {Icon && (
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform" style={{ backgroundColor: bgColor }}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate === "modern") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {heading || "Features"}
              </h2>
              {subheading && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {subheading}
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} gap-10`}>
              {features.map((feature, index) => {
                const Icon = getIcon(feature.icon);
                return (
                  <div key={feature.id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                    <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                      {Icon && (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md" style={{ backgroundColor: primaryColor }}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (selectedTemplate === "minimal") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                {heading || "Features"}
              </h2>
              {subheading && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {subheading}
                </p>
              )}
            </div>
            <div className={`grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${columns >= 4 ? "lg:grid-cols-4" : columns >= 3 ? "lg:grid-cols-3" : ""} gap-16`}>
              {features.map((feature) => {
                const Icon = getIcon(feature.icon);
                return (
                  <div key={feature.id} className="text-center group">
                    {Icon && (
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 group-hover:border-gray-900 transition-colors">
                        <Icon className="w-9 h-9 text-gray-600 group-hover:text-gray-900 transition-colors" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Features"}
            </h2>
            {subheading && (
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <div className={`grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-8`}>
            {features.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div key={feature.id} className="group text-center p-8 rounded-2xl transition-all hover:shadow-xl border border-gray-100 hover:border-transparent bg-white">
                  {Icon && (
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:shadow-lg transition-shadow" style={{ backgroundColor: primaryColor }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCTA = () => {
    const { heading, subheading, primaryButton, secondaryButton, features, highlightText } = section.props;
    const overlayStyle = getOverlayStyle();
    const primaryColor = themeColors?.primary || "#6366f1";

    if (selectedTemplate === "bold") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {highlightText && (
              <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold">
                {highlightText}
              </div>
            )}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white leading-tight">
              {heading || "Ready to get started?"}
            </h2>
            {subheading && (
              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
                {subheading}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              {primaryButton?.text && (
                <a href={primaryButton.link || "#"} className="px-12 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105">
                  {primaryButton.text}
                </a>
              )}
              {secondaryButton?.text && (
                <a href={secondaryButton.link || "#"} className="px-12 py-5 border-3 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all">
                  {secondaryButton.text}
                </a>
              )}
            </div>
            {features && features.length > 0 && (
              <div className="flex flex-wrap gap-6 justify-center text-white/80 text-sm">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <LucideIcons.Check className="w-5 h-5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (selectedTemplate === "minimal") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-tight">
              {heading || "Ready to get started?"}
            </h2>
            {subheading && (
              <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {primaryButton?.text && (
                <a href={primaryButton.link || "#"} className="px-10 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-all">
                  {primaryButton.text}
                </a>
              )}
              {secondaryButton?.text && (
                <a href={secondaryButton.link || "#"} className="px-10 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-black transition-all">
                  {secondaryButton.text}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white leading-tight">
            {heading || "Ready to get started?"}
          </h2>
          {subheading && (
            <p className="text-lg md:text-xl mb-12 text-white/90 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            {primaryButton?.text && (
              <a href={primaryButton.link || "#"} className="px-10 py-4 bg-white rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1" style={{ color: primaryColor }}>
                {primaryButton.text}
              </a>
            )}
            {secondaryButton?.text && (
              <a href={secondaryButton.link || "#"} className="px-10 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                {secondaryButton.text}
              </a>
            )}
          </div>
          {features && features.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center text-white/80 text-sm">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <LucideIcons.Check className="w-5 h-5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const { heading, content, image, imagePosition = "right", showcaseItems } = section.props;
    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";

    if (selectedTemplate === "minimal") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12 tracking-tight text-center">
              {heading || "Content Heading"}
            </h2>
            <div className="prose prose-lg prose-gray max-w-none mx-auto text-center" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }} dangerouslySetInnerHTML={{ __html: content || "<p>Content goes here...</p>" }} />
          </div>
        </div>
      );
    }

    if (hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={imagePosition === "left" ? "lg:order-2" : ""}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {heading || "Content Heading"}
                </h2>
                <div className="prose prose-lg prose-gray max-w-none" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }} dangerouslySetInnerHTML={{ __html: content || "<p>Content goes here...</p>" }} />
                {showcaseItems && showcaseItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-8 mt-12">
                    {showcaseItems.map((item, idx) => {
                      const Icon = getIcon(item.icon);
                      return (
                        <div key={idx} className="text-center">
                          {Icon && <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: themeColors?.primary }} />}
                          <div className="text-3xl font-bold text-gray-900">{item.stat}</div>
                          <div className="text-sm text-gray-600 mt-1">{item.label}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={imagePosition === "left" ? "lg:order-1" : ""}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-2xl"></div>
                  <img src={image} alt={heading} className="relative w-full h-auto rounded-2xl shadow-2xl" />
                </div>
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-10" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Content Heading"}
          </h2>
          <div className="prose prose-lg prose-gray max-w-none" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }} dangerouslySetInnerHTML={{ __html: content || "<p>Content goes here...</p>" }} />
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    const { heading, subheading, images = [], items = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();
    const displayItems = items.length > 0 ? items : images;

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Gallery"}
            </h2>
            {subheading && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <div className={`grid grid-cols-1 ${columns >= 2 ? "sm:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-8`}>
            {displayItems.length > 0 ? displayItems.map((item, idx) => (
              <div key={item.id || idx} className="group relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                {item.image ? (
                  <img src={item.image} alt={item.title || `Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : typeof item === "string" ? (
                  <img src={item} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                )}
                {item.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      {item.category && <p className="text-sm text-gray-300">{item.category}</p>}
                    </div>
                  </div>
                )}
              </div>
            )) : Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonials = () => {
    const { heading, subheading, testimonials = [] } = section.props;
    const overlayStyle = getOverlayStyle();
    const primaryColor = themeColors?.primary || "#6366f1";

    if (selectedTemplate === "modern" || selectedTemplate === "bold") {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle}></div>}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                {heading || "Testimonials"}
              </h2>
              {subheading && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                  {subheading}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {testimonials.map((test) => (
                <div key={test.id} className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                  <div className="relative p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                    <div className="absolute -top-6 -left-6 text-8xl text-indigo-100 font-serif">"</div>
                    <div className="flex items-center mb-6">
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <LucideIcons.Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-8 text-lg leading-relaxed relative z-10">
                      {test.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mr-4 overflow-hidden border-4 border-white shadow-lg">
                          {test.avatar && <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{test.name}</p>
                          <p className="text-sm text-gray-600">{test.role}</p>
                        </div>
                      </div>
                      {test.metric && (
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: primaryColor }}>{test.metric}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16 text-center" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
            {heading || "Testimonials"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.map((test) => (
              <div key={test.id} className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <LucideIcons.Star key={i} className="w-5 h-5 fill-current" style={{ color: primaryColor }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">"{test.content}"</p>
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
    const primaryColor = themeColors?.primary || "#6366f1";

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Pricing"}
            </h2>
            {subheading && (
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {plans.map((plan) => (
              <div key={plan.id} className={`relative rounded-3xl p-10 transition-all hover:shadow-2xl ${plan.highlighted ? "ring-4 shadow-2xl transform lg:scale-110 z-10" : "border-2 border-gray-200 bg-white hover:border-gray-300"}`} style={plan.highlighted ? { borderColor: primaryColor, backgroundColor: "white" } : {}}>
                {plan.badge && plan.highlighted && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg" style={{ backgroundColor: primaryColor }}>
                    {plan.badge}
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                    {plan.savings}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  )}
                </div>
                <div className="mb-10">
                  <span className="text-6xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 text-lg ml-2">/{plan.period}</span>}
                </div>
                <ul className="space-y-5 mb-12">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <LucideIcons.Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href={plan.ctaLink || "#"} className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-all ${plan.highlighted ? "text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`} style={plan.highlighted ? { backgroundColor: primaryColor } : {}}>
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
    const { heading, subheading, fields = [], submitText } = section.props;
    const overlayStyle = getOverlayStyle();
    const primaryColor = themeColors?.primary || "#6366f1";

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Contact Us"}
            </h2>
            {subheading && (
              <p className="text-lg md:text-xl text-gray-600" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <form className="space-y-8 bg-white p-10 rounded-3xl shadow-2xl">
            {fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none" style={{ "--tw-ring-color": primaryColor }} rows="6"></textarea>
                ) : (
                  <input type={field.type} className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all" style={{ "--tw-ring-color": primaryColor }} />
                )}
              </div>
            ))}
            <button className="w-full py-5 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1" style={{ backgroundColor: primaryColor }}>
              {submitText || "Submit"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderTeam = () => {
    const { heading, subheading, members = [], columns = 3 } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "Our Team"}
            </h2>
            {subheading && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <div className={`grid grid-cols-1 ${columns >= 2 ? "sm:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-12`}>
            {members.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative mb-8 inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
                  <div className="relative w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow">
                    {member.image && <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
                  {member.name}
                </h3>
                <p className="mb-4 font-medium" style={{ color: themeColors?.primary || "#6366f1" }}>
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ color: section.style?.backgroundType === "image" ? "#d1d5db" : undefined }}>
                  {member.bio}
                </p>
                {member.socials && (
                  <div className="flex justify-center gap-4 mt-6">
                    {Object.entries(member.socials).map(([platform, link]) => (
                      <a key={platform} href={link} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <LucideIcons.Link className="w-5 h-5 text-gray-600" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFAQ = () => {
    const { heading, subheading, questions = [], faqs = [] } = section.props;
    const overlayStyle = getOverlayStyle();
    const items = faqs.length > 0 ? faqs : questions;

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6" style={{ color: section.style?.backgroundType === "image" ? "#ffffff" : undefined }}>
              {heading || "FAQ"}
            </h2>
            {subheading && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ color: section.style?.backgroundType === "image" ? "#e5e7eb" : undefined }}>
                {subheading}
              </p>
            )}
          </div>
          <div className="space-y-6">
            {items.map((q) => (
              <div key={q.id} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-transparent transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: themeColors?.primary || "#6366f1" }}>
                    Q
                  </span>
                  <span className="flex-1">{q.question}</span>
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    const { stats = [] } = section.props;
    const overlayStyle = getOverlayStyle();

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center group">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 group-hover:scale-110 transition-transform" style={{ color: themeColors?.primary }}>
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNewsletter = () => {
    const { heading, subheading, placeholder, buttonText, benefits = [] } = section.props;
    const overlayStyle = getOverlayStyle();
    const primaryColor = themeColors?.primary || "#6366f1";

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle}></div>}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {heading || "Stay Updated"}
          </h2>
          {subheading && (
            <p className="text-lg md:text-xl text-white/90 mb-10">
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
            <input type="email" placeholder={placeholder || "Enter your email"} className="flex-1 px-6 py-4 rounded-xl border-2 border-transparent focus:border-white focus:outline-none text-lg" />
            <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg">
              {buttonText || "Subscribe"}
            </button>
          </div>
          {benefits.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center text-white/80 text-sm">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <LucideIcons.Check className="w-5 h-5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
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
    case "stats":
      return renderStats();
    case "newsletter":
      return renderNewsletter();
    default:
      return (
        <div className="py-16 text-center text-gray-500">
          Unknown section type: {section.type}
        </div>
      );
  }
}