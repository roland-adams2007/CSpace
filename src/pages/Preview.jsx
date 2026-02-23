import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./../api/axiosInstance";
import SectionRenderer from "../components/ui/theme/SectionRenderer";
import NotFound from "../components/errors/NotFound";

export default function Preview() {
  const { themeSlug, websiteSlug } = useParams();

  const [theme, setTheme] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteInfo, setWebsiteInfo] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const hasFetched = useRef(false);
  const currentSlug = useRef(null);

  const isPreviewMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "true";

  useEffect(() => {
    const loadContent = async () => {
      const slugToLoad = themeSlug || websiteSlug;

      if (currentSlug.current === slugToLoad && hasFetched.current) return;

      currentSlug.current = slugToLoad;
      setLoading(true);
      setError(null);
      setNotFound(false);
      hasFetched.current = true;

      try {
        let themeData = null;
        let websiteData = null;

        if (themeSlug) {
          const response = await axiosInstance.get(
            `/public/themes/${themeSlug}${isPreviewMode ? "?preview=true" : ""}`,
          );
          themeData = response.data.data.theme;

          if (themeData && themeData.website_id) {
            try {
              const websiteResponse = await axiosInstance.get(
                `/public/websites/${themeData.website_id}${isPreviewMode ? "?preview=true" : ""}`,
              );
              websiteData = websiteResponse.data.data.website;
              setWebsiteInfo(websiteData);
            } catch (websiteErr) {
              console.error("Failed to fetch website info for theme:", websiteErr);
            }
          }
        } else if (websiteSlug) {
          const websiteResponse = await axiosInstance.get(
            `/public/websites/${websiteSlug}${isPreviewMode ? "?preview=true" : ""}`,
          );
          websiteData = websiteResponse.data.data.website;
          setWebsiteInfo(websiteData);

          if (!isPreviewMode && websiteData.is_published !== true) {
            setNotFound(true);
            setError("This website is not published");
            setLoading(false);
            return;
          }

          const themeResponse = await axiosInstance.get(
            `/public/websites/${websiteSlug}/active-theme${isPreviewMode ? "?preview=true" : ""}`,
          );
          themeData = themeResponse.data.data.theme;
        }

        if (themeData) {
          setTheme(themeData);
          let configData = themeData.config_json;
          if (typeof configData === "string") configData = JSON.parse(configData);
          setConfig(configData);
        } else {
          setNotFound(true);
          setError(themeSlug ? "Theme not found" : "Website not found");
        }
      } catch (err) {
        console.error("Failed to load preview:", err);

        if (err.response?.status === 404) {
          setNotFound(true);
          setError(themeSlug ? "Theme not found" : "Website not found");
        } else if (err.response?.status === 403) {
          setNotFound(true);
          setError("This website is private or not published");
        } else {
          setError(err?.response?.data?.message || "Failed to load preview.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (themeSlug || websiteSlug) {
      loadContent();
    }
  }, [themeSlug, websiteSlug, isPreviewMode]);

  if (loading && isPreviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading preview…</p>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {error.includes("published") ? "Website Not Published" : "Preview Unavailable"}
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        {error.includes("published") && isPreviewMode ? (
          <p className="text-xs text-amber-600 mt-1">
            You're in preview mode, but this website is not published yet.
          </p>
        ) : (
          <button
            onClick={() => { hasFetched.current = false; window.location.reload(); }}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!config) return null;

  const sections = config.layout?.sections || [];
  const themeColors = config.theme?.colors || {};
  const fonts = config.theme?.fonts || {};
  const loader = config.siteSettings?.loader;

  const headingFont = fonts.heading || "Inter";
  const bodyFont = fonts.body || "Inter";
  const googleFontsUrl = buildGoogleFontsUrl([headingFont, bodyFont]);

  const isPublished = websiteInfo?.is_published === true || websiteInfo?.is_published === 1;
  const isActive = theme?.is_active === true || theme?.is_active === 1;

  const previewInfo = {
    type: themeSlug ? "theme" : "website",
    name: theme?.name || websiteInfo?.name,
    slug: themeSlug || websiteSlug,
    websiteName: websiteInfo?.name,
    isPublished,
    isActive,
    themeName: theme?.name,
    isPreviewMode,
  };

  // Separate header/footer from body sections so we can control their wrappers
  const headerSection = sections.find((s) => s.type === "header");
  const footerSection = sections.find((s) => s.type === "footer");
  const bodySections = sections.filter((s) => s.type !== "header" && s.type !== "footer");

  return (
    <>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body {
          font-family: '${bodyFont}', sans-serif;
          background-color: ${themeColors.background || "#ffffff"};
          color: ${themeColors.text || "#111827"};
        }
        h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', sans-serif; }
      `}</style>

      {loader?.enabled && <StartupLoader loader={loader} />}
      {isPreviewMode && <PreviewBanner previewInfo={previewInfo} />}

      {!isPreviewMode && websiteInfo && !isPublished && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-1 text-xs">
          This website is in draft mode. Only published websites are visible to the public.
        </div>
      )}

      {!isPreviewMode && theme && !isActive && themeSlug && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-1 text-xs">
          This theme is not active. The website may not display correctly.
        </div>
      )}

      {sections.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/*
            Header: rendered WITHOUT a wrapper div so position:sticky on the inner
            element works against the viewport (the natural scroll container).
            Any wrapping div — even an empty one — can break sticky in some browsers.
          */}
          {headerSection && (
            <SectionRenderer
              key={headerSection.id}
              section={headerSection}
              themeColors={themeColors}
              isPreview={true}
            />
          )}

          {/* Body sections each get an anchor div for scroll-to navigation */}
          {bodySections.map((section) => (
            <div key={section.id} id={section.id}>
              <SectionRenderer
                section={section}
                themeColors={themeColors}
                isPreview={true}
              />
            </div>
          ))}

          {/* Footer: also unwrapped */}
          {footerSection && (
            <SectionRenderer
              key={footerSection.id}
              section={footerSection}
              themeColors={themeColors}
              isPreview={true}
            />
          )}
        </>
      )}
    </>
  );
}

function PreviewBanner({ previewInfo }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const { type, name, slug, websiteName, isPublished, isActive, themeName } = previewInfo;

  let bannerColor = "#4f46e5";
  if (type === "website" && !isPublished) bannerColor = "#f59e0b";
  else if (type === "theme" && !isActive) bannerColor = "#f59e0b";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-between px-5 py-2.5 text-white text-sm shadow-lg"
      style={{ backgroundColor: bannerColor }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse flex-shrink-0" />
        <span className="font-semibold tracking-tight">Preview Mode</span>

        {type === "website" && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${isPublished ? "bg-green-500" : "bg-amber-500"}`}>
              {isPublished ? "published" : "draft"}
            </span>
          </>
        )}
        {type === "theme" && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${isActive ? "bg-green-500" : "bg-amber-500"}`}>
              {isActive ? "active" : "inactive"}
            </span>
          </>
        )}
        {type === "theme" && themeName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-85 truncate max-w-[200px]">Theme: {themeName}</span>
          </>
        )}
        {websiteName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-60 truncate max-w-[150px] text-xs">Site: {websiteName}</span>
          </>
        )}
        {type === "website" && name && !themeName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-85 truncate max-w-[200px]">{name}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs opacity-60">
          {slug && <span className="font-mono">{type === "theme" ? "/t/" : "/c/"}{slug}</span>}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 transition-colors"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function StartupLoader({ loader }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = loader.duration || 2000;
    const fadeAt = Math.max(duration - 400, 0);
    const fadeTimer = setTimeout(() => setFading(true), fadeAt);
    const hideTimer = setTimeout(() => setVisible(false), duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [loader.duration]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[99999]"
      style={{
        backgroundColor: loader.backgroundColor || "#ffffff",
        opacity: fading ? 0 : 1,
        transition: "opacity 400ms ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {loader.type === "spinner" && (
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${loader.spinnerColor || "#6366f1"} transparent transparent transparent` }}
        />
      )}
      {loader.type === "progress" && (
        <div className="w-52">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: loader.spinnerColor || "#6366f1",
                width: "100%",
                transition: `width ${(loader.duration || 2000) - 300}ms linear`,
              }}
            />
          </div>
        </div>
      )}
      {loader.type === "image" && loader.image && (
        <img src={loader.image} alt="Loading" className="max-h-24 max-w-xs object-contain animate-pulse" />
      )}
      {loader.type === "svg" && loader.svg && (
        <div dangerouslySetInnerHTML={{ __html: loader.svg }} />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">No sections yet</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        This theme has no content sections. Add sections in the editor to see them here.
      </p>
    </div>
  );
}

function buildGoogleFontsUrl(fontNames) {
  const systemFonts = new Set(["system-ui", "Arial", "Georgia", "serif", "sans-serif", "monospace", "Inter"]);
  const toLoad = [...new Set(fontNames)].filter((f) => f && !systemFonts.has(f));
  if (toLoad.length === 0) return null;
  const families = toLoad
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}