import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useThemeStore } from "../store/store";
import { useWebsiteStore } from "../store/store";
import SectionRenderer from "../components/ui/theme/SectionRenderer";

export default function Preview() {
  const { themeSlug, websiteSlug } = useParams();
  const { getTheme, fetchThemes } = useThemeStore();
  const { selectedWebsite, fetchWebsites, setSelectedWebsite, websites } = useWebsiteStore();

  const [theme, setTheme] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use refs to track if we've already fetched
  const hasFetchedWebsites = useRef(false);
  const hasFetchedTheme = useRef(false);
  const currentSlug = useRef(null);

  const isPreviewMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "true";

  // Handle website context - only fetch if needed
  useEffect(() => {
    const initWebsite = async () => {
      // If we have websiteSlug in URL
      if (websiteSlug) {
        // First check if we already have websites loaded
        let availableWebsites = websites;
        
        // Only fetch if we don't have websites and haven't tried before
        if (availableWebsites.length === 0 && !hasFetchedWebsites.current) {
          hasFetchedWebsites.current = true;
          try {
            availableWebsites = await fetchWebsites();
          } catch (err) {
            console.error("Failed to load websites:", err);
            setError("Failed to load website");
            setLoading(false);
            return;
          }
        }
        
        // Find the website with matching slug
        const website = availableWebsites.find(w => w.slug === websiteSlug);
        if (website) {
          // Check if website is published (if not in preview mode)
          if (!isPreviewMode && website.status !== 'published') {
            setError("This website is not published and cannot be viewed");
            setLoading(false);
            return;
          }
          
          // Only set if it's different from current selection
          if (selectedWebsite?.id !== website.id) {
            setSelectedWebsite(website);
          }
        } else {
          setError("Website not found");
          setLoading(false);
        }
      }
    };

    initWebsite();
  }, [websiteSlug]); // Remove selectedWebsite and websites from dependencies

  // Load theme - only when we have the necessary context
  useEffect(() => {
    // Don't proceed if we don't have the right context yet
    if (websiteSlug && !selectedWebsite) return;
    if (!themeSlug && !websiteSlug) return;
    
    // Check if we're already loading this slug
    const slugToLoad = themeSlug || websiteSlug;
    if (currentSlug.current === slugToLoad && hasFetchedTheme.current) return;
    
    currentSlug.current = slugToLoad;
    
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      hasFetchedTheme.current = true;
      
      try {
        let themeData = null;

        // If we have a themeSlug, load that specific theme
        if (themeSlug) {
          themeData = await getTheme(themeSlug);
        } 
        // If we only have websiteSlug, load the active theme for that website
        else if (websiteSlug && selectedWebsite) {
          // Check again if website is published (for non-preview mode)
          if (!isPreviewMode && selectedWebsite.status !== 'published') {
            setError("This website is not published and cannot be viewed");
            setLoading(false);
            return;
          }
          
          // Fetch themes for this website (only if we don't have them cached)
          const themes = await fetchThemes(selectedWebsite.id);
          const activeTheme = themes.find(t => t.is_active === 1 || t.is_active === true);
          
          if (activeTheme) {
            // Check if we already have this theme loaded
            if (theme?.id !== activeTheme.id) {
              themeData = await getTheme(activeTheme.slug);
            } else {
              themeData = theme;
            }
          } else {
            setError("No active theme found for this website");
            setLoading(false);
            return;
          }
        }

        if (themeData) {
          setTheme(themeData);
          let configData = themeData.config_json;
          if (typeof configData === "string") configData = JSON.parse(configData);
          setConfig(configData);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load preview.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [themeSlug, websiteSlug, selectedWebsite]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading preview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          {error.includes('published') ? 'Website Not Published' : 'Preview Unavailable'}
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        {error.includes('published') && isPreviewMode ? (
          <p className="text-xs text-amber-600 mt-1">
            You're in preview mode, but this website is not published yet.
          </p>
        ) : (
          <button
            onClick={() => {
              hasFetchedWebsites.current = false;
              hasFetchedTheme.current = false;
              window.location.reload();
            }}
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

  const previewInfo = {
    type: themeSlug ? 'theme' : 'website',
    name: theme?.name || selectedWebsite?.name,
    slug: themeSlug || websiteSlug,
    websiteName: selectedWebsite?.name,
    websiteStatus: selectedWebsite?.status,
    themeName: theme?.name,
    isPreviewMode
  };

  return (
    <>
      {googleFontsUrl && <link rel="stylesheet" href={googleFontsUrl} />}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { font-family: '${bodyFont}', sans-serif; background-color: ${themeColors.background || "#ffffff"}; color: ${themeColors.text || "#111827"}; }
        h1, h2, h3, h4, h5, h6 { font-family: '${headingFont}', sans-serif; }
      `}</style>

      {loader?.enabled && <StartupLoader loader={loader} />}

      {isPreviewMode && (
        <PreviewBanner 
          previewInfo={previewInfo}
        />
      )}

      {/* Show a subtle draft indicator if viewing an unpublished website in preview mode */}
      {!isPreviewMode && selectedWebsite?.status !== 'published' && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-amber-500 text-white text-center py-1 text-xs">
          This website is in draft mode. Only published websites are visible to the public.
        </div>
      )}

      {sections.length === 0 ? (
        <EmptyState />
      ) : (
        sections.map((section) => (
          <SectionAnchor key={section.id} id={section.id}>
            <SectionRenderer
              section={section}
              themeColors={themeColors}
              isPreview={isPreviewMode}
            />
          </SectionAnchor>
        ))
      )}
    </>
  );
}

// Helper components remain the same...
function SectionAnchor({ id, children }) {
  const isHeader = id?.startsWith("header") || false;
  if (isHeader) {
    return children;
  }
  return <div id={id}>{children}</div>;
}

function PreviewBanner({ previewInfo }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  
  const { type, name, slug, websiteName, websiteStatus, themeName, isPreviewMode } = previewInfo;
  
  // Determine banner color based on status
  const bannerColor = websiteStatus === 'published' ? "#4f46e5" : "#f59e0b";
  
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-between px-5 py-2.5 text-white text-sm shadow-lg"
      style={{ backgroundColor: bannerColor }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse flex-shrink-0" />
        <span className="font-semibold tracking-tight">Preview Mode</span>
        
        {/* Status indicator */}
        {websiteStatus && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              websiteStatus === 'published' ? 'bg-green-500' : 'bg-amber-500'
            }`}>
              {websiteStatus}
            </span>
          </>
        )}
        
        {type === 'theme' && themeName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-85 truncate max-w-[200px]">
              Theme: {themeName}
            </span>
          </>
        )}
        {websiteName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-60 truncate max-w-[150px] text-xs">
              Site: {websiteName}
            </span>
          </>
        )}
        {type === 'website' && name && !themeName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-85 truncate max-w-[200px]">
              {name}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs opacity-60">
          {slug && (
            <span className="font-mono">
              {type === 'theme' ? '/t/' : '/c/'}{slug}
            </span>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/20 transition-colors"
          aria-label="Dismiss banner"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
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
          style={{
            borderColor: `${loader.spinnerColor || "#6366f1"} transparent transparent transparent`,
          }}
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
        <img
          src={loader.image}
          alt="Loading"
          className="max-h-24 max-w-xs object-contain animate-pulse"
        />
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
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-800">No sections yet</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        This theme has no content sections. Add sections in the editor to see
        them here.
      </p>
    </div>
  );
}

function buildGoogleFontsUrl(fontNames) {
  const systemFonts = new Set([
    "system-ui",
    "Arial",
    "Georgia",
    "serif",
    "sans-serif",
    "monospace",
    "Inter",
  ]);
  const toLoad = [...new Set(fontNames)].filter(
    (f) => f && !systemFonts.has(f),
  );
  if (toLoad.length === 0) return null;
  const families = toLoad
    .map(
      (f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900`,
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}