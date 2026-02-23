import { SECTION_TYPES } from "../../../utils/sectionLibrary";
import * as LucideIcons from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useWebsiteStore } from "../../../store/store";

export default function SectionRenderer({
  section,
  themeColors,
  isPreview = false,
}) {
  const { selectedWebsite } = useWebsiteStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [formState, setFormState] = useState({
    loading: false,
    success: false,
    error: false,
    message: "",
  });
  const carousel = section.props.carousel;
  const variant = section.props.variant || "default";

  useEffect(() => {
    setCurrentSlide(0);
  }, [variant]);

  const primaryColor = themeColors?.primary || "#6366f1";

  const isCarousel = variant === "carousel" || carousel?.enabled === true;
  const isSplit = variant === "split";
  const isList = variant === "list";

  // In the editor canvas we block all link navigation; in preview we allow it
  const handleLinkClick = isPreview ? undefined : (e) => e.preventDefault();

  const getCarouselItems = () => {
    if (section.props.testimonials) return section.props.testimonials;
    if (section.props.items) return section.props.items;
    if (section.props.logos) return section.props.logos;
    return [];
  };

  useEffect(() => {
    let interval;
    if (isCarousel && carousel?.autoplay) {
      const slides =
        carousel.slides?.length > 0 ? carousel.slides : getCarouselItems();
      if (slides.length > 1) {
        interval = setInterval(() => {
          setCurrentSlide((p) => (p + 1) % slides.length);
        }, carousel.interval || 5000);
      }
    }
    return () => clearInterval(interval);
  }, [isCarousel, carousel?.autoplay, carousel?.interval]);

  const getIcon = (iconName) => {
    if (!iconName) return null;
    const pascal = iconName
      .split("-")
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join("");
    return LucideIcons[pascal] || LucideIcons.Box;
  };

  const getSectionStyle = () => {
    const style = { position: "relative" };
    if (
      section.type === SECTION_TYPES.HEADER ||
      section.type === SECTION_TYPES.FOOTER
    )
      return style;

    if (section.style?.padding) {
      if (section.style.padding.top != null)
        style.paddingTop = section.style.padding.top;
      else style.paddingTop = "4rem";
      if (section.style.padding.bottom != null)
        style.paddingBottom = section.style.padding.bottom;
      else style.paddingBottom = "4rem";
    } else {
      style.paddingTop = "4rem";
      style.paddingBottom = "4rem";
    }

    if (section.style?.backgroundType === "color") {
      style.backgroundColor = section.style?.backgroundColor || "transparent";
    } else if (section.style?.backgroundType === "gradient") {
      style.background =
        section.style?.backgroundGradient ||
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    } else if (
      section.style?.backgroundType === "image" &&
      section.style?.backgroundImage
    ) {
      style.backgroundImage = `url(${section.style.backgroundImage})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }
    return style;
  };

  const getOverlayStyle = () => {
    if (
      section.style?.backgroundType === "image" &&
      section.style?.backgroundImage &&
      section.style?.backgroundOverlay > 0
    ) {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `rgba(0,0,0,${section.style.backgroundOverlay})`,
        zIndex: 1,
      };
    }
    return null;
  };

  const textOnBg = (fallback = "#111827") =>
    section.style?.backgroundType === "image" ? "#ffffff" : fallback;

  const CarouselDots = ({ slides, current, onDotClick }) => {
    if (!slides || slides.length <= 1) return null;
    return (
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`rounded-full transition-all ${i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    );
  };

  const CarouselArrows = ({ slides, onPrev, onNext }) => {
    if (!slides || slides.length <= 1) return null;
    return (
      <>
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <LucideIcons.ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          <LucideIcons.ChevronRight className="w-5 h-5" />
        </button>
      </>
    );
  };

  const prev = (len) => setCurrentSlide((p) => (p - 1 + len) % len);
  const next = (len) => setCurrentSlide((p) => (p + 1) % len);

  const handleFormSubmit = async (
    e,
    successMessage,
    errorMessage,
    setLocalState,
  ) => {
    e.preventDefault();
    setLocalState({ loading: true, success: false, error: false, message: "" });
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      await axiosInstance.post("/forms/submit", {
        website_id: selectedWebsite?.id,
        section_id: section.id,
        section_type: section.type,
        data,
      });
      setLocalState({
        loading: false,
        success: true,
        error: false,
        message: successMessage || "Message sent!",
      });
      e.target.reset();
    } catch {
      setLocalState({
        loading: false,
        success: false,
        error: true,
        message: errorMessage || "Something went wrong. Please try again.",
      });
    }
  };

  const renderHeader = () => {
    const p = section.props;
    const logoHeight = p.logoHeight || 40;

    const containerStyle = {
      height: p.height || "80px",
      backgroundColor: p.transparent
        ? "transparent"
        : p.backgroundColor || "#ffffff",
      backdropFilter: p.blur ? "blur(12px)" : "none",
      WebkitBackdropFilter: p.blur ? "blur(12px)" : "none",
      // sticky only works when the element is directly inside the scroll container
      // In editor (canvas) we keep it relative so it doesn't escape the canvas scroll area
      position:
        p.sticky && isPreview ? "sticky" : p.sticky ? "sticky" : "relative",
      top: 0,
      zIndex: 100,
      borderBottom: p.borderBottom
        ? `1px solid ${p.borderColor || "#e5e7eb"}`
        : "none",
    };

    const renderNavLinks = () => (
      <nav className="hidden md:flex items-center gap-6">
        {(p.menu || []).map((item, idx) => (
          <div key={idx} className="relative group/nav">
            <a
              href={item.url || "#"}
              onClick={handleLinkClick}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: p.textColor || "#111827" }}
            >
              {item.label}
              {item.hasSubmenu && item.submenu?.length > 0 && (
                <LucideIcons.ChevronDown className="w-3.5 h-3.5" />
              )}
            </a>
            {item.hasSubmenu && item.submenu?.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all z-50">
                {item.submenu.map((sub, sIdx) => (
                  <a
                    key={sIdx}
                    href={sub.url || "#"}
                    onClick={handleLinkClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );

    const renderSearch = () =>
      p.showSearch && (
        <div className="flex items-center">
          {searchOpen ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg transition-all">
              <LucideIcons.Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none w-32 text-gray-700 placeholder-gray-400"
                onBlur={() => setSearchOpen(false)}
              />
              <button onClick={() => setSearchOpen(false)}>
                <LucideIcons.X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: p.searchIconColor || p.textColor || "#111827" }}
            >
              <LucideIcons.Search className="w-5 h-5" />
            </button>
          )}
        </div>
      );

    const renderCta = () =>
      p.showCta &&
      p.ctaText && (
        <a
          href={p.ctaLink || "#"}
          onClick={handleLinkClick}
          className="hidden md:inline-flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all"
          style={
            p.ctaStyle === "outline"
              ? {
                  border: `2px solid ${p.ctaColor || primaryColor}`,
                  color: p.ctaColor || primaryColor,
                  backgroundColor: "transparent",
                }
              : {
                  backgroundColor: p.ctaColor || primaryColor,
                  color: p.ctaTextColor || "#ffffff",
                }
          }
        >
          {p.ctaText}
        </a>
      );

    const renderLogo = () =>
      p.showLogo && (
        <a
          href={`/c/${selectedWebsite?.slug}`}
          onClick={handleLinkClick}
          className="flex-shrink-0 flex items-center gap-2"
        >
          {p.logo ? (
            <img
              src={p.logo}
              alt="Logo"
              style={{
                height: `${logoHeight}px`,
                width: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <span
              className="text-lg font-bold"
              style={{ color: p.textColor || "#111827" }}
            >
              {p.logoText || "Brand"}
            </span>
          )}
        </a>
      );

    const renderMobileToggle = () => (
      <button
        className="md:hidden p-2 rounded-lg transition-colors"
        style={{ color: p.textColor || "#111827" }}
        onClick={(e) => {
          e.stopPropagation();
          setMobileMenuOpen(!mobileMenuOpen);
        }}
      >
        {mobileMenuOpen ? (
          <LucideIcons.X className="w-6 h-6" />
        ) : (
          <LucideIcons.Menu className="w-6 h-6" />
        )}
      </button>
    );

    const renderMobileMenu = () =>
      mobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 shadow-lg border-t py-4 z-50"
          style={{
            backgroundColor: p.backgroundColor || "#ffffff",
            borderColor: p.borderColor || "#e5e7eb",
          }}
        >
          <div className="px-4 space-y-1">
            {(p.menu || []).map((item, idx) => (
              <div key={idx}>
                <a
                  href={item.url || "#"}
                  onClick={(e) => {
                    if (!isPreview) e.preventDefault();
                    if (item.hasSubmenu)
                      setOpenSubmenu(openSubmenu === idx ? null : idx);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: p.textColor || "#111827" }}
                >
                  {item.label}
                  {item.hasSubmenu && item.submenu?.length > 0 && (
                    <LucideIcons.ChevronDown
                      className={`w-4 h-4 transition-transform ${openSubmenu === idx ? "rotate-180" : ""}`}
                    />
                  )}
                </a>
                {item.hasSubmenu && openSubmenu === idx && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((sub, sIdx) => (
                      <a
                        key={sIdx}
                        href={sub.url || "#"}
                        onClick={handleLinkClick}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900 rounded-lg transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {p.showSearch && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg mt-2">
                <LucideIcons.Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
                />
              </div>
            )}
            {p.showCta && p.ctaText && (
              <div className="pt-2">
                <a
                  href={p.ctaLink || "#"}
                  onClick={handleLinkClick}
                  className="block text-center px-5 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    backgroundColor: p.ctaColor || primaryColor,
                    color: p.ctaTextColor || "#ffffff",
                  }}
                >
                  {p.ctaText}
                </a>
              </div>
            )}
          </div>
        </div>
      );

    let content;
    if (variant === "centered") {
      content = (
        <div className="flex flex-col items-center gap-4">
          {renderLogo()}
          <div className="flex items-center gap-6">
            {renderNavLinks()}
            {renderSearch()}
            {renderCta()}
          </div>
        </div>
      );
    } else if (variant === "nav-left") {
      content = (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-8">{renderNavLinks()}</div>
          <div className="flex items-center gap-4">{renderLogo()}</div>
          <div className="flex items-center gap-4">
            {renderSearch()}
            {renderCta()}
            {renderMobileToggle()}
          </div>
        </div>
      );
    } else if (variant === "split") {
      const half = Math.ceil((p.menu || []).length / 2);
      const leftMenu = (p.menu || []).slice(0, half);
      const rightMenu = (p.menu || []).slice(half);
      content = (
        <div className="flex items-center justify-between w-full">
          <nav className="hidden md:flex items-center gap-6">
            {leftMenu.map((item, idx) => (
              <a
                key={idx}
                href={item.url || "#"}
                onClick={handleLinkClick}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: p.textColor || "#111827" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          {renderLogo()}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {rightMenu.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url || "#"}
                  onClick={handleLinkClick}
                  className="text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: p.textColor || "#111827" }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {renderSearch()}
            {renderCta()}
            {renderMobileToggle()}
          </div>
        </div>
      );
    } else if (variant === "minimal") {
      content = (
        <div className="flex items-center justify-between w-full">
          {renderLogo()}
          <div className="flex items-center gap-4">
            {renderSearch()}
            {renderCta()}
            {renderMobileToggle()}
          </div>
        </div>
      );
    } else {
      content = (
        <div className="flex items-center justify-between w-full">
          {renderLogo()}
          <div className="hidden md:flex items-center gap-8">
            {renderNavLinks()}
          </div>
          <div className="flex items-center gap-4">
            {renderSearch()}
            {renderCta()}
            {renderMobileToggle()}
          </div>
        </div>
      );
    }

    return (
      <div style={containerStyle} className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          {content}
        </div>
        {renderMobileMenu()}
      </div>
    );
  };

  const renderFooter = () => {
    const p = section.props;
    const [newsletterState, setNewsletterState] = useState({
      loading: false,
      success: false,
      error: false,
      message: "",
    });
    const logoHeight = p.logoHeight || 40;

    const containerStyle = {
      backgroundColor: p.backgroundColor || "#111827",
      color: p.textColor || "#ffffff",
      padding: p.padding || "3rem 0",
    };

    const handleNewsletterSubmit = async (e) => {
      e.preventDefault();
      const email = e.target.email?.value;
      setNewsletterState({
        loading: true,
        success: false,
        error: false,
        message: "",
      });
      try {
        await axiosInstance.post("/forms/submit", {
          website_id: selectedWebsite?.id,
          section_id: section.id,
          section_type: "footer_newsletter",
          data: { email },
        });
        setNewsletterState({
          loading: false,
          success: true,
          error: false,
          message: p.newsletter?.successMessage || "Subscribed!",
        });
        e.target.reset();
      } catch {
        setNewsletterState({
          loading: false,
          success: false,
          error: true,
          message:
            p.newsletter?.errorMessage ||
            "Something went wrong. Please try again.",
        });
      }
    };

    if (variant === "simple") {
      return (
        <div style={containerStyle}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                {p.showLogo &&
                  (p.logo ? (
                    <img
                      src={p.logo}
                      alt="Logo"
                      style={{
                        height: `${logoHeight}px`,
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <span
                      className="text-lg font-bold"
                      style={{
                        color: p.logoTextColor || p.textColor || "#ffffff",
                      }}
                    >
                      {p.logoText || "Brand"}
                    </span>
                  ))}
                {p.tagline && (
                  <span
                    className="text-sm"
                    style={{ color: p.taglineColor || "rgba(255,255,255,0.6)" }}
                  >
                    {p.tagline}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-6">
                {(p.columns || [])
                  .flatMap((col) => col.links || [])
                  .map((link, i) => (
                    <a
                      key={i}
                      href={link.url || "#"}
                      onClick={handleLinkClick}
                      className="text-sm transition-colors hover:opacity-100"
                      style={{ color: p.linkColor || "#9ca3af" }}
                    >
                      {link.label}
                    </a>
                  ))}
              </div>
              {p.showSocial && (
                <div className="flex gap-3">
                  {(p.socialLinks || []).map((s, i) => (
                    <a
                      key={i}
                      href={s.url || "#"}
                      target={isPreview ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="text-sm font-medium transition-colors hover:opacity-100"
                      style={{ color: p.linkColor || "#9ca3af" }}
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
            {p.copyright && (
              <div
                className="mt-6 pt-6 text-center text-sm"
                style={{
                  borderTop: `1px solid ${p.dividerColor || "rgba(255,255,255,0.1)"}`,
                  color: p.copyrightColor || "rgba(255,255,255,0.4)",
                }}
              >
                {p.copyright}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (variant === "centered") {
      return (
        <div style={containerStyle}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {p.showLogo && (
              <div className="mb-6 flex justify-center">
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt="Logo"
                    style={{ height: `${logoHeight}px`, objectFit: "contain" }}
                  />
                ) : (
                  <span
                    className="text-xl font-bold"
                    style={{
                      color: p.logoTextColor || p.textColor || "#ffffff",
                    }}
                  >
                    {p.logoText || "Brand"}
                  </span>
                )}
              </div>
            )}
            {p.tagline && (
              <p
                className="mb-8 text-sm"
                style={{ color: p.taglineColor || "rgba(255,255,255,0.6)" }}
              >
                {p.tagline}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {(p.columns || [])
                .flatMap((col) => col.links || [])
                .map((link, i) => (
                  <a
                    key={i}
                    href={link.url || "#"}
                    onClick={handleLinkClick}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: p.linkColor || "#9ca3af" }}
                  >
                    {link.label}
                  </a>
                ))}
            </div>
            {p.showSocial && (
              <div className="flex justify-center gap-4 mb-8">
                {(p.socialLinks || []).map((s, i) => (
                  <a
                    key={i}
                    href={s.url || "#"}
                    target={isPreview ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-sm font-medium transition-colors hover:opacity-100"
                    style={{ color: p.linkColor || "#9ca3af" }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
            {p.copyright && (
              <p
                className="text-sm"
                style={{ color: p.copyrightColor || "rgba(255,255,255,0.4)" }}
              >
                {p.copyright}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (variant === "minimal") {
      return (
        <div style={containerStyle}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            {p.showLogo &&
              (p.logo ? (
                <img
                  src={p.logo}
                  alt="Logo"
                  style={{ height: `${logoHeight}px`, objectFit: "contain" }}
                />
              ) : (
                <span
                  className="text-base font-bold"
                  style={{ color: p.logoTextColor || p.textColor || "#ffffff" }}
                >
                  {p.logoText || "Brand"}
                </span>
              ))}
            {p.copyright && (
              <p
                className="text-xs"
                style={{ color: p.copyrightColor || "rgba(255,255,255,0.4)" }}
              >
                {p.copyright}
              </p>
            )}
            {p.showSocial && (
              <div className="flex gap-4">
                {(p.socialLinks || []).map((s, i) => (
                  <a
                    key={i}
                    href={s.url || "#"}
                    target={isPreview ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-xs font-medium transition-colors hover:opacity-100"
                    style={{ color: p.linkColor || "#9ca3af" }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={containerStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`grid gap-8 mb-8 ${
              (p.columns?.length || 0) === 0
                ? "grid-cols-1"
                : (p.columns?.length || 0) <= 2
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                  : (p.columns?.length || 0) === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
            }`}
          >
            {(p.showLogo || p.tagline) && (
              <div className="lg:col-span-2">
                {p.showLogo && (
                  <div className="mb-4">
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt="Logo"
                        style={{
                          height: `${logoHeight}px`,
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: p.logoTextColor || p.textColor || "#ffffff",
                        }}
                      >
                        {p.logoText || "Brand"}
                      </span>
                    )}
                  </div>
                )}
                {p.tagline && (
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: p.taglineColor || "rgba(255,255,255,0.6)" }}
                  >
                    {p.tagline}
                  </p>
                )}
                {p.showSocial && (
                  <div className="flex gap-3 flex-wrap">
                    {(p.socialLinks || []).map((s, i) => (
                      <a
                        key={i}
                        href={s.url || "#"}
                        target={isPreview ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        className="text-sm font-medium transition-colors hover:opacity-100"
                        style={{ color: p.linkColor || "#9ca3af" }}
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
            {(p.columns || []).map((col, idx) => (
              <div key={idx}>
                <h4
                  className="font-semibold mb-4 text-sm uppercase tracking-wide"
                  style={{
                    color: p.columnTitleColor || p.textColor || "#ffffff",
                  }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {(col.links || []).map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.url || "#"}
                        onClick={handleLinkClick}
                        className="text-sm transition-colors hover:opacity-100"
                        style={{ color: p.linkColor || "#9ca3af" }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {p.showNewsletter && p.newsletter && (
            <div
              className="py-8"
              style={{
                borderTop: `1px solid ${p.dividerColor || "rgba(255,255,255,0.1)"}`,
                borderBottom: `1px solid ${p.dividerColor || "rgba(255,255,255,0.1)"}`,
              }}
            >
              <h4
                className="font-semibold mb-4"
                style={{ color: p.textColor || "#ffffff" }}
              >
                {p.newsletter.title}
              </h4>
              {newsletterState.success ? (
                <p className="text-sm" style={{ color: "#86efac" }}>
                  {newsletterState.message}
                </p>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex gap-2 max-w-md"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={p.newsletter.placeholder || "Enter your email"}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <button
                    type="submit"
                    disabled={newsletterState.loading}
                    className="px-5 py-2 rounded-lg font-medium text-sm transition-colors"
                    style={{
                      backgroundColor: p.accentColor || primaryColor,
                      color: "#ffffff",
                    }}
                  >
                    {newsletterState.loading
                      ? "..."
                      : p.newsletter.buttonText || "Subscribe"}
                  </button>
                </form>
              )}
              {newsletterState.error && (
                <p className="text-sm mt-2 text-red-400">
                  {newsletterState.message}
                </p>
              )}
            </div>
          )}

          {p.copyright && (
            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p
                className="text-sm"
                style={{ color: p.copyrightColor || "rgba(255,255,255,0.4)" }}
              >
                {p.copyright}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHero = () => {
    const {
      heading,
      subheading,
      ctaText,
      ctaLink,
      ctaColor,
      ctaTextColor,
      secondaryCtaText,
      secondaryCtaLink,
      secondaryCtaColor,
      secondaryCtaBorderColor,
      secondaryCtaTextColor,
      headingColor,
      subheadingColor,
      image,
      alignment = "center",
    } = section.props;
    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";

    if (isCarousel && carousel?.slides?.length > 0) {
      const slides = carousel.slides;
      const slide = slides[currentSlide] || {};
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="relative min-h-[600px] flex items-center overflow-hidden">
            {slide.image && (
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            )}
            <CarouselDots
              slides={slides}
              current={currentSlide}
              onDotClick={setCurrentSlide}
            />
            <CarouselArrows
              slides={slides}
              onPrev={() => prev(slides.length)}
              onNext={() => next(slides.length)}
            />
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white w-full">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {slide.heading || heading || "Slide Heading"}
              </h1>
              <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
                {slide.subheading || subheading || ""}
              </p>
              {slide.ctaText && (
                <a
                  href={slide.ctaLink || "#"}
                  onClick={handleLinkClick}
                  className="inline-block px-10 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
                >
                  {slide.ctaText}
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (isSplit || (hasImage && variant !== "centered")) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                  style={{ color: headingColor || textOnBg() }}
                >
                  {heading || "Hero Heading"}
                </h1>
                <p
                  className="text-lg md:text-xl mb-8 leading-relaxed"
                  style={{ color: subheadingColor || textOnBg("#6b7280") }}
                >
                  {subheading || "Hero subheading goes here"}
                </p>
                <div className="flex flex-wrap gap-4">
                  {ctaText && (
                    <a
                      href={ctaLink || "#"}
                      onClick={handleLinkClick}
                      className="inline-block px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      style={{
                        backgroundColor: ctaColor || primaryColor,
                        color: ctaTextColor || "#ffffff",
                      }}
                    >
                      {ctaText}
                    </a>
                  )}
                  {secondaryCtaText && (
                    <a
                      href={secondaryCtaLink || "#"}
                      onClick={handleLinkClick}
                      className="inline-block px-8 py-4 border-2 rounded-xl font-semibold transition-all"
                      style={{
                        borderColor: secondaryCtaBorderColor || "#e5e7eb",
                        backgroundColor: secondaryCtaColor || "transparent",
                        color: secondaryCtaTextColor || "#374151",
                      }}
                    >
                      {secondaryCtaText}
                    </a>
                  )}
                </div>
              </div>
              <div className="relative">
                {hasImage ? (
                  <>
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-2xl" />
                    <img
                      src={image}
                      alt={heading}
                      className="relative w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <LucideIcons.Image className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div
          className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-${alignment} relative z-10`}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight"
            style={{ color: headingColor || textOnBg() }}
          >
            {heading || "Hero Heading"}
          </h1>
          <p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ color: subheadingColor || textOnBg("#6b7280") }}
          >
            {subheading || "Hero subheading goes here"}
          </p>
          <div
            className={`flex flex-wrap gap-4 justify-${alignment === "center" ? "center" : "start"}`}
          >
            {ctaText && (
              <a
                href={ctaLink || "#"}
                onClick={handleLinkClick}
                className="inline-block px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                style={{
                  backgroundColor: ctaColor || primaryColor,
                  color: ctaTextColor || "#ffffff",
                }}
              >
                {ctaText}
              </a>
            )}
            {secondaryCtaText && (
              <a
                href={secondaryCtaLink || "#"}
                onClick={handleLinkClick}
                className="inline-block px-10 py-4 border-2 rounded-xl font-semibold transition-all"
                style={{
                  borderColor: secondaryCtaBorderColor || "#e5e7eb",
                  backgroundColor: secondaryCtaColor || "transparent",
                  color: secondaryCtaTextColor || "#374151",
                }}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeatures = () => {
    const {
      heading,
      subheading,
      features = [],
      columns = 3,
      headingColor,
      subheadingColor,
      cardBackground,
      cardBorderColor,
      iconBackground,
      iconColor,
      titleColor,
      descriptionColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    const gridCls = `grid grid-cols-1 ${columns >= 2 ? "md:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-8`;

    if (isList) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              heading={heading || "Features"}
              subheading={subheading}
              headingColor={headingColor || textOnBg()}
              subheadingColor={subheadingColor}
            />
            <div className="space-y-6">
              {features.map((feature) => {
                const Icon = getIcon(feature.icon);
                return (
                  <div
                    key={feature.id}
                    className="flex items-start gap-5 p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md"
                    style={{
                      backgroundColor: cardBackground || "#ffffff",
                      borderColor: cardBorderColor || "#f3f4f6",
                    }}
                  >
                    {Icon && (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: iconBackground || primaryColor,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: iconColor || "#ffffff" }}
                        />
                      </div>
                    )}
                    <div>
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ color: titleColor || "#111827" }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="leading-relaxed"
                        style={{ color: descriptionColor || "#6b7280" }}
                      >
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

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Features"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className={gridCls}>
            {features.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={feature.id}
                  className="group text-center p-8 rounded-2xl transition-all hover:shadow-xl border"
                  style={{
                    backgroundColor: cardBackground || "#ffffff",
                    borderColor: cardBorderColor || "#f3f4f6",
                  }}
                >
                  {Icon && (
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md"
                      style={{
                        backgroundColor: iconBackground || primaryColor,
                      }}
                    >
                      <Icon
                        className="w-7 h-7"
                        style={{ color: iconColor || "#ffffff" }}
                      />
                    </div>
                  )}
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: titleColor || "#111827" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: descriptionColor || "#6b7280" }}
                  >
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

  const renderStats = () => {
    const {
      heading,
      subheading,
      stats = [],
      headingColor,
      subheadingColor,
      valueColor,
      labelColor,
      descriptionColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {(heading || subheading) && (
            <SectionHeading
              heading={heading}
              subheading={subheading}
              headingColor={headingColor || textOnBg()}
              subheadingColor={subheadingColor}
            />
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center group">
                <div
                  className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 group-hover:scale-110 transition-transform"
                  style={{ color: valueColor || primaryColor }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-lg font-semibold mb-1"
                  style={{ color: labelColor || textOnBg() }}
                >
                  {stat.label}
                </div>
                {stat.description && (
                  <div
                    className="text-sm"
                    style={{ color: descriptionColor || textOnBg("#6b7280") }}
                  >
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

  const renderProcess = () => {
    const {
      heading,
      subheading,
      steps = [],
      headingColor,
      subheadingColor,
      iconBackground,
      iconColor,
      stepTitleColor,
      stepDescColor,
      stepDurationColor,
      numberColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Our Process"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div
            className={`grid grid-cols-1 ${steps.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"} gap-8`}
          >
            {steps.map((step, idx) => {
              const Icon = getIcon(step.icon);
              return (
                <div key={step.id} className="relative group">
                  <div
                    className="text-5xl font-black mb-3"
                    style={{
                      color: numberColor || primaryColor,
                      opacity: 0.15,
                    }}
                  >
                    {step.number || String(idx + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: iconBackground || primaryColor }}
                  >
                    {Icon && (
                      <Icon
                        className="w-7 h-7"
                        style={{ color: iconColor || "#ffffff" }}
                      />
                    )}
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: stepTitleColor || textOnBg() }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: stepDescColor || textOnBg("#6b7280") }}
                  >
                    {step.description}
                  </p>
                  {step.duration && (
                    <p
                      className="text-sm font-medium mt-3"
                      style={{ color: stepDurationColor || primaryColor }}
                    >
                      ⏱ {step.duration}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const {
      heading,
      content,
      image,
      imagePosition = "right",
      headingColor,
      contentColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    const hasImage = image && image.trim() !== "";

    if (isSplit || hasImage) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={imagePosition === "left" ? "lg:order-2" : ""}>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
                  style={{ color: headingColor || textOnBg() }}
                >
                  {heading || "Content Heading"}
                </h2>
                <div
                  className="prose prose-lg prose-gray max-w-none"
                  style={{ color: contentColor || textOnBg("#374151") }}
                  dangerouslySetInnerHTML={{
                    __html: content || "<p>Content goes here...</p>",
                  }}
                />
              </div>
              <div className={imagePosition === "left" ? "lg:order-1" : ""}>
                {hasImage ? (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-2xl" />
                    <img
                      src={image}
                      alt={heading}
                      className="relative w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <LucideIcons.Image className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10"
            style={{ color: headingColor || textOnBg() }}
          >
            {heading || "Content Heading"}
          </h2>
          <div
            className="prose prose-lg prose-gray max-w-none"
            style={{ color: contentColor || textOnBg("#374151") }}
            dangerouslySetInnerHTML={{
              __html: content || "<p>Content goes here...</p>",
            }}
          />
        </div>
      </div>
    );
  };

  const renderGallery = () => {
    const {
      heading,
      subheading,
      items = [],
      columns = 3,
      headingColor,
      subheadingColor,
      overlayColor,
      titleColor,
      categoryColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    const gridCls = `grid grid-cols-1 ${columns >= 2 ? "sm:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-8`;

    const GalleryItem = ({ item, idx }) => (
      <div
        key={item.id || idx}
        className="group relative aspect-square bg-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title || `Gallery ${idx + 1}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        {item.title && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6"
            style={{ background: overlayColor || "rgba(0,0,0,0.7)" }}
          >
            <div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: titleColor || "#ffffff" }}
              >
                {item.title}
              </h3>
              {item.category && (
                <p
                  className="text-sm"
                  style={{ color: categoryColor || "#d1d5db" }}
                >
                  {item.category}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );

    if (isCarousel && items.length > 0) {
      const slide = items[currentSlide] || {};
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              heading={heading || "Gallery"}
              subheading={subheading}
              headingColor={headingColor || textOnBg()}
              subheadingColor={subheadingColor}
            />
            <div className="relative overflow-hidden rounded-2xl">
              <div className="aspect-video relative">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
                {slide.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                    <h3
                      className="text-2xl font-bold"
                      style={{ color: titleColor || "#ffffff" }}
                    >
                      {slide.title}
                    </h3>
                    {slide.category && (
                      <p
                        className="mt-1"
                        style={{ color: categoryColor || "#d1d5db" }}
                      >
                        {slide.category}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <CarouselDots
                slides={items}
                current={currentSlide}
                onDotClick={setCurrentSlide}
              />
              <CarouselArrows
                slides={items}
                onPrev={() => prev(items.length)}
                onNext={() => next(items.length)}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Gallery"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className={gridCls}>
            {items.length > 0
              ? items.map((item, idx) => (
                  <GalleryItem key={item.id || idx} item={item} idx={idx} />
                ))
              : Array(6)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"
                    />
                  ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonials = () => {
    const {
      heading,
      subheading,
      testimonials = [],
      headingColor,
      subheadingColor,
      cardBackground,
      quoteColor,
      nameColor,
      roleColor,
      metricColor,
      starColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();

    if (isCarousel && testimonials.length > 0) {
      const slide = testimonials[currentSlide] || {};
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              heading={heading || "Testimonials"}
              subheading={subheading}
              headingColor={headingColor || textOnBg()}
              subheadingColor={subheadingColor}
            />
            <div
              className="relative rounded-3xl p-10 md:p-14 shadow-2xl"
              style={{ backgroundColor: cardBackground || "#ffffff" }}
            >
              <CarouselDots
                slides={testimonials}
                current={currentSlide}
                onDotClick={setCurrentSlide}
              />
              <div className="text-center">
                <div className="flex justify-center mb-5">
                  {[...Array(slide.rating || 5)].map((_, i) => (
                    <LucideIcons.Star
                      key={i}
                      className="w-6 h-6 fill-current"
                      style={{ color: starColor || "#f59e0b" }}
                    />
                  ))}
                </div>
                <p
                  className="text-xl md:text-2xl mb-8 italic leading-relaxed"
                  style={{ color: quoteColor || "#374151" }}
                >
                  "{slide.content}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full overflow-hidden">
                    {slide.avatar && (
                      <img
                        src={slide.avatar}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p
                      className="font-bold text-lg"
                      style={{ color: nameColor || "#111827" }}
                    >
                      {slide.name}
                    </p>
                    <p style={{ color: roleColor || "#6b7280" }}>
                      {slide.role}
                    </p>
                    {slide.metric && (
                      <p
                        className="font-bold mt-1"
                        style={{ color: metricColor || primaryColor }}
                      >
                        {slide.metric}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => prev(testimonials.length)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-500 transition-colors"
                >
                  <LucideIcons.ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => next(testimonials.length)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-500 transition-colors"
                >
                  <LucideIcons.ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Testimonials"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: cardBackground || "#ffffff" }}
              >
                <div className="flex mb-4">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <LucideIcons.Star
                      key={i}
                      className="w-5 h-5 fill-current"
                      style={{ color: starColor || primaryColor }}
                    />
                  ))}
                </div>
                <p
                  className="mb-6 text-lg leading-relaxed italic"
                  style={{ color: quoteColor || "#374151" }}
                >
                  "{test.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      {test.avatar && (
                        <img
                          src={test.avatar}
                          alt={test.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: nameColor || "#111827" }}
                      >
                        {test.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: roleColor || "#6b7280" }}
                      >
                        {test.role}
                      </p>
                    </div>
                  </div>
                  {test.metric && (
                    <span
                      className="text-xl font-bold"
                      style={{ color: metricColor || primaryColor }}
                    >
                      {test.metric}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLogos = () => {
    const {
      heading,
      subheading,
      logos = [],
      columns = 4,
      headingColor,
      subheadingColor,
      logoFilter,
    } = section.props;
    const overlayStyle = getOverlayStyle();

    if (isCarousel && logos.length > 0) {
      const doubled = [...logos, ...logos];
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                heading={heading || "Trusted by Industry Leaders"}
                subheading={subheading}
                headingColor={headingColor || textOnBg()}
                subheadingColor={subheadingColor}
              />
            </div>
            <div className="relative overflow-hidden">
              <div
                className="flex gap-12 animate-scroll"
                style={{ animationDuration: `${logos.length * 3}s` }}
              >
                {doubled.map((logo, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 flex items-center justify-center h-20 px-6"
                  >
                    {logo.image ? (
                      <img
                        src={logo.image}
                        alt={logo.name}
                        className={`max-h-12 w-auto object-contain transition-all ${logoFilter === "grayscale" ? "grayscale hover:grayscale-0" : ""}`}
                      />
                    ) : (
                      <div className="px-6 py-3 bg-gray-100 rounded-lg text-gray-500 text-sm font-medium whitespace-nowrap">
                        {logo.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Trusted by Industry Leaders"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div
            className={`grid grid-cols-2 md:grid-cols-${Math.min(columns, 6)} gap-10 items-center`}
          >
            {logos.map((logo) => (
              <div key={logo.id} className="flex justify-center">
                {logo.image ? (
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className={`max-h-14 w-auto object-contain transition-all ${logoFilter === "grayscale" ? "grayscale hover:grayscale-0" : ""}`}
                  />
                ) : (
                  <div className="px-6 py-3 bg-gray-100 rounded-lg text-gray-500 text-sm font-medium">
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBenefits = () => {
    const {
      heading,
      subheading,
      benefits = [],
      headingColor,
      subheadingColor,
      cardBackground,
      iconBackground,
      iconColor,
      titleColor,
      descriptionColor,
      metricColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();

    if (isList) {
      return (
        <div style={getSectionStyle()}>
          {overlayStyle && <div style={overlayStyle} />}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              heading={heading || "Benefits"}
              subheading={subheading}
              headingColor={headingColor || textOnBg()}
              subheadingColor={subheadingColor}
            />
            <div className="space-y-4">
              {benefits.map((b) => {
                const Icon = getIcon(b.icon);
                return (
                  <div
                    key={b.id}
                    className="flex items-start gap-4 p-5 rounded-xl border shadow-sm hover:shadow-md transition-all"
                    style={{ backgroundColor: cardBackground || "#ffffff" }}
                  >
                    {Icon && (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: iconBackground || primaryColor,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: iconColor || "#ffffff" }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3
                        className="font-semibold mb-1"
                        style={{ color: titleColor || "#111827" }}
                      >
                        {b.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: descriptionColor || "#6b7280" }}
                      >
                        {b.description}
                      </p>
                    </div>
                    {b.metric && (
                      <span
                        className="text-xl font-black flex-shrink-0"
                        style={{ color: metricColor || primaryColor }}
                      >
                        {b.metric}
                      </span>
                    )}
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
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Benefits"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((b) => {
              const Icon = getIcon(b.icon);
              return (
                <div
                  key={b.id}
                  className="flex gap-5 p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: cardBackground || "#ffffff" }}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: iconBackground || primaryColor,
                      }}
                    >
                      {Icon && (
                        <Icon
                          className="w-7 h-7"
                          style={{ color: iconColor || "#ffffff" }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: titleColor || "#111827" }}
                      >
                        {b.title}
                      </h3>
                      {b.metric && (
                        <span
                          className="text-2xl font-black"
                          style={{ color: metricColor || primaryColor }}
                        >
                          {b.metric}
                        </span>
                      )}
                    </div>
                    <p
                      className="leading-relaxed"
                      style={{ color: descriptionColor || "#6b7280" }}
                    >
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderCTA = () => {
    const {
      heading,
      subheading,
      primaryButton,
      secondaryButton,
      features,
      headingColor,
      subheadingColor,
      featureColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight"
            style={{ color: headingColor || "#ffffff" }}
          >
            {heading || "Ready to get started?"}
          </h2>
          {subheading && (
            <p
              className="text-lg md:text-xl mb-12 max-w-2xl mx-auto"
              style={{ color: subheadingColor || "rgba(255,255,255,0.9)" }}
            >
              {subheading}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {primaryButton?.text && (
              <a
                href={primaryButton.link || "#"}
                onClick={handleLinkClick}
                className="px-10 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                style={{
                  backgroundColor: primaryButton.backgroundColor || "#ffffff",
                  color: primaryButton.textColor || primaryColor,
                }}
              >
                {primaryButton.text}
              </a>
            )}
            {secondaryButton?.text && (
              <a
                href={secondaryButton.link || "#"}
                onClick={handleLinkClick}
                className="px-10 py-4 border-2 rounded-xl font-semibold hover:bg-white/10 transition-all"
                style={{
                  borderColor: secondaryButton.borderColor || "#ffffff",
                  color: secondaryButton.textColor || "#ffffff",
                }}
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
          {features?.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              {features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <LucideIcons.Check
                    className="w-4 h-4"
                    style={{ color: featureColor || "rgba(255,255,255,0.8)" }}
                  />
                  <span
                    style={{ color: featureColor || "rgba(255,255,255,0.8)" }}
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPricing = () => {
    const {
      heading,
      subheading,
      plans = [],
      headingColor,
      subheadingColor,
      cardBackground,
      cardBorderColor,
      highlightColor,
      planNameColor,
      planPriceColor,
      planDescColor,
      featureColor,
      checkColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Pricing"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-9 transition-all hover:shadow-2xl ${plan.highlighted ? "shadow-2xl lg:scale-105 z-10" : "border-2 hover:border-gray-300"}`}
                style={{
                  backgroundColor: cardBackground || "#ffffff",
                  borderColor: !plan.highlighted
                    ? cardBorderColor || "#e5e7eb"
                    : undefined,
                  outline: plan.highlighted
                    ? `4px solid ${highlightColor || primaryColor}`
                    : undefined,
                }}
              >
                {plan.badge && plan.highlighted && (
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-white text-sm font-bold shadow-lg"
                    style={{ backgroundColor: highlightColor || primaryColor }}
                  >
                    {plan.badge}
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow">
                    {plan.savings}
                  </div>
                )}
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ color: planNameColor || "#111827" }}
                >
                  {plan.name}
                </h3>
                {plan.description && (
                  <p
                    className="text-sm mb-6"
                    style={{ color: planDescColor || "#6b7280" }}
                  >
                    {plan.description}
                  </p>
                )}
                <div className="mb-8">
                  <span
                    className="text-5xl font-bold"
                    style={{ color: planPriceColor || "#111827" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className="ml-1"
                      style={{ color: planDescColor || "#6b7280" }}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <LucideIcons.Check
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: checkColor || "#22c55e" }}
                      />
                      <span style={{ color: featureColor || "#374151" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.ctaLink || "#"}
                  onClick={handleLinkClick}
                  className={`block w-full py-4 rounded-xl font-bold text-lg text-center transition-all ${plan.highlighted ? "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1" : "bg-gray-100 hover:bg-gray-200"}`}
                  style={{
                    backgroundColor: plan.highlighted
                      ? highlightColor || primaryColor
                      : undefined,
                    color: plan.highlighted
                      ? "#ffffff"
                      : planNameColor || "#111827",
                  }}
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
    const {
      heading,
      subheading,
      fields = [],
      submitText,
      successMessage,
      errorMessage,
      headingColor,
      subheadingColor,
      cardBackground,
      labelColor,
      inputBorderColor,
      buttonColor,
      buttonTextColor,
    } = section.props;
    const [localState, setLocalState] = useState({
      loading: false,
      success: false,
      error: false,
      message: "",
    });
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Contact Us"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div
            className="rounded-3xl shadow-2xl p-10"
            style={{ backgroundColor: cardBackground || "#ffffff" }}
          >
            {localState.success ? (
              <div className="text-center py-8">
                <LucideIcons.CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium text-gray-900">
                  {localState.message || successMessage || "Message sent!"}
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) =>
                  handleFormSubmit(
                    e,
                    successMessage,
                    errorMessage,
                    setLocalState,
                  )
                }
                className="space-y-6"
              >
                {fields.map((field) => (
                  <div key={field.id}>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: labelColor || "#374151" }}
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.label.toLowerCase()}
                        rows={5}
                        required={field.required}
                        placeholder={field.placeholder || ""}
                        className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-colors resize-none"
                        style={{ borderColor: inputBorderColor || "#e5e7eb" }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.label.toLowerCase()}
                        required={field.required}
                        placeholder={field.placeholder || ""}
                        className="w-full px-4 py-3 border-2 rounded-xl outline-none transition-colors"
                        style={{ borderColor: inputBorderColor || "#e5e7eb" }}
                      />
                    )}
                  </div>
                ))}
                {localState.error && (
                  <p className="text-red-500 text-sm">{localState.message}</p>
                )}
                <button
                  type="submit"
                  disabled={localState.loading}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-60"
                  style={{
                    backgroundColor: buttonColor || primaryColor,
                    color: buttonTextColor || "#ffffff",
                  }}
                >
                  {localState.loading ? "Sending..." : submitText || "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTeam = () => {
    const {
      heading,
      subheading,
      members = [],
      columns = 3,
      headingColor,
      subheadingColor,
      nameColor,
      roleColor,
      bioColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    const gridCls = `grid grid-cols-1 ${columns >= 2 ? "sm:grid-cols-2" : ""} ${columns >= 3 ? "lg:grid-cols-3" : ""} ${columns >= 4 ? "xl:grid-cols-4" : ""} gap-10`;
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Our Team"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className={gridCls}>
            {members.map((m) => (
              <div key={m.id} className="text-center group">
                <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow mb-6">
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: nameColor || textOnBg() }}
                >
                  {m.name}
                </h3>
                <p
                  className="font-medium mb-3"
                  style={{ color: roleColor || primaryColor }}
                >
                  {m.role}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: bioColor || textOnBg("#6b7280") }}
                >
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFAQ = () => {
    const {
      heading,
      subheading,
      faqs = [],
      questions = [],
      headingColor,
      subheadingColor,
      cardBackground,
      cardBorderColor,
      questionColor,
      answerColor,
      badgeBackground,
      badgeTextColor,
    } = section.props;
    const items = faqs.length > 0 ? faqs : questions;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "FAQ"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className="space-y-4">
            {items.map((q) => (
              <div
                key={q.id}
                className="border-2 rounded-2xl p-7 hover:shadow-lg hover:border-transparent transition-all"
                style={{
                  backgroundColor: cardBackground || "#ffffff",
                  borderColor: cardBorderColor || "#e5e7eb",
                }}
              >
                <h3
                  className="text-lg font-bold mb-3 flex items-start gap-3"
                  style={{ color: questionColor || "#111827" }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: badgeBackground || primaryColor,
                      color: badgeTextColor || "#ffffff",
                    }}
                  >
                    Q
                  </span>
                  <span className="flex-1">{q.question}</span>
                </h3>
                <p
                  className="leading-relaxed pl-10"
                  style={{ color: answerColor || "#6b7280" }}
                >
                  {q.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNewsletter = () => {
    const {
      heading,
      subheading,
      placeholder,
      buttonText,
      benefits = [],
      successMessage,
      errorMessage,
      headingColor,
      subheadingColor,
      inputBackground,
      inputTextColor,
      inputBorderColor,
      buttonColor,
      buttonTextColor,
      benefitColor,
    } = section.props;
    const [localState, setLocalState] = useState({
      loading: false,
      success: false,
      error: false,
      message: "",
    });
    const overlayStyle = getOverlayStyle();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target.email?.value;
      setLocalState({
        loading: true,
        success: false,
        error: false,
        message: "",
      });
      try {
        await axiosInstance.post("/forms/submit", {
          website_id: selectedWebsite?.id,
          section_id: section.id,
          section_type: section.type,
          data: { email },
        });
        setLocalState({
          loading: false,
          success: true,
          error: false,
          message: successMessage || "Subscribed!",
        });
        e.target.reset();
      } catch {
        setLocalState({
          loading: false,
          success: false,
          error: true,
          message: errorMessage || "Something went wrong. Please try again.",
        });
      }
    };

    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: headingColor || "#ffffff" }}
          >
            {heading || "Stay Updated"}
          </h2>
          {subheading && (
            <p
              className="text-lg mb-10"
              style={{ color: subheadingColor || "rgba(255,255,255,0.85)" }}
            >
              {subheading}
            </p>
          )}
          {localState.success ? (
            <p
              className="text-lg font-medium py-4"
              style={{ color: "#86efac" }}
            >
              {localState.message}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
            >
              <input
                type="email"
                name="email"
                required
                placeholder={placeholder || "Enter your email"}
                className="flex-1 px-5 py-4 rounded-xl border-2 outline-none text-base"
                style={{
                  backgroundColor: inputBackground || "rgba(255,255,255,0.1)",
                  color: inputTextColor || "#ffffff",
                  borderColor: inputBorderColor || "transparent",
                }}
              />
              <button
                type="submit"
                disabled={localState.loading}
                className="px-8 py-4 rounded-xl font-bold whitespace-nowrap disabled:opacity-60"
                style={{
                  backgroundColor: buttonColor || "#ffffff",
                  color: buttonTextColor || primaryColor,
                }}
              >
                {localState.loading ? "..." : buttonText || "Subscribe"}
              </button>
            </form>
          )}
          {localState.error && (
            <p className="text-sm text-red-300 mb-4">{localState.message}</p>
          )}
          {benefits.length > 0 && (
            <div className="flex flex-wrap gap-5 justify-center text-sm">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <LucideIcons.Check
                    className="w-4 h-4"
                    style={{ color: benefitColor || "rgba(255,255,255,0.75)" }}
                  />
                  <span
                    style={{ color: benefitColor || "rgba(255,255,255,0.75)" }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCaseStudies = () => {
    const {
      heading,
      subheading,
      studies = [],
      headingColor,
      subheadingColor,
      cardBackground,
      titleColor,
      descriptionColor,
      clientBadgeBackground,
      clientBadgeColor,
      resultBadgeBackground,
      resultBadgeColor,
      metricValueColor,
      metricLabelColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Success Stories"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {studies.map((study) => (
              <div
                key={study.id}
                className="group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
                style={{ backgroundColor: cardBackground || "#ffffff" }}
              >
                <div className="relative h-56 overflow-hidden">
                  {study.image ? (
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className="text-xl font-bold"
                      style={{ color: titleColor || "#111827" }}
                    >
                      {study.title}
                    </h3>
                    {study.client && (
                      <span
                        className="px-3 py-1 rounded-full text-xs flex-shrink-0 ml-3"
                        style={{
                          backgroundColor: clientBadgeBackground || "#f3f4f6",
                          color: clientBadgeColor || "#6b7280",
                        }}
                      >
                        {study.client}
                      </span>
                    )}
                  </div>
                  <p
                    className="mb-5 leading-relaxed"
                    style={{ color: descriptionColor || "#6b7280" }}
                  >
                    {study.description}
                  </p>
                  {study.results?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.results.map((r, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: resultBadgeBackground || "#dcfce7",
                            color: resultBadgeColor || "#166534",
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                  {study.metrics?.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 pt-5 border-t border-gray-100">
                      {study.metrics.map((m, i) => (
                        <div key={i} className="text-center">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: metricValueColor || primaryColor }}
                          >
                            {m.value}
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: metricLabelColor || "#6b7280" }}
                          >
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTrust = () => {
    const {
      heading,
      subheading,
      badges = [],
      awards = [],
      headingColor,
      subheadingColor,
      iconBackground,
      iconColor,
      badgeTitleColor,
      badgeDescColor,
      awardBackground,
      awardBorderColor,
      awardTextColor,
    } = section.props;
    const overlayStyle = getOverlayStyle();
    return (
      <div style={getSectionStyle()}>
        {overlayStyle && <div style={overlayStyle} />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            heading={heading || "Trusted & Secure"}
            subheading={subheading}
            headingColor={headingColor || textOnBg()}
            subheadingColor={subheadingColor}
          />
          {badges.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
              {badges.map((b) => {
                const Icon = getIcon(b.icon);
                return (
                  <div key={b.id} className="text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: iconBackground || "#eef2ff" }}
                    >
                      {Icon && (
                        <Icon
                          className="w-8 h-8"
                          style={{ color: iconColor || primaryColor }}
                        />
                      )}
                    </div>
                    <h3
                      className="font-bold mb-1"
                      style={{ color: badgeTitleColor || "#111827" }}
                    >
                      {b.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: badgeDescColor || "#6b7280" }}
                    >
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {awards.length > 0 && (
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Recognized by
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {awards.map((award, i) => (
                  <span
                    key={i}
                    className="px-5 py-2.5 border-2 rounded-full font-medium text-sm"
                    style={{
                      backgroundColor: awardBackground || "#ffffff",
                      borderColor: awardBorderColor || "#e5e7eb",
                      color: awardTextColor || "#374151",
                    }}
                  >
                    🏆 {award}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  switch (section.type) {
    case SECTION_TYPES.HEADER:
      return renderHeader();
    case SECTION_TYPES.FOOTER:
      return renderFooter();
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
    case SECTION_TYPES.STATS:
      return renderStats();
    case SECTION_TYPES.NEWSLETTER:
      return renderNewsletter();
    case SECTION_TYPES.PROCESS:
      return renderProcess();
    case SECTION_TYPES.BENEFITS:
      return renderBenefits();
    case SECTION_TYPES.LOGOS:
      return renderLogos();
    case SECTION_TYPES.CASE_STUDIES:
      return renderCaseStudies();
    case SECTION_TYPES.TRUST:
      return renderTrust();
    default:
      return (
        <div className="py-16 text-center text-gray-400 bg-gray-50">
          Unknown section type: {section.type}
        </div>
      );
  }
}

function SectionHeading({
  heading,
  subheading,
  headingColor,
  subheadingColor,
}) {
  if (!heading && !subheading) return null;
  return (
    <div className="text-center mb-16">
      {heading && (
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
          style={{ color: headingColor || "#111827" }}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p
          className="text-lg max-w-3xl mx-auto leading-relaxed"
          style={{ color: subheadingColor || "#6b7280" }}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
