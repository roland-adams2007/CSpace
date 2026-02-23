import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useThemeStore } from "../store/store";
import SectionRenderer from "../components/ui/theme/SectionRenderer";

export default function Preview() {
  const { themeSlug } = useParams();
  const { getTheme } = useThemeStore();

  const [theme, setTheme] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isPreviewMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "true";

  useEffect(() => {
    if (!themeSlug) return;
    loadTheme();
  }, [themeSlug]);

  const loadTheme = async () => {
    setLoading(true);
    setError(null);
    try {
      const themeData = await getTheme(themeSlug);
      setTheme(themeData);
      let configData = themeData.config_json;
      if (typeof configData === "string") configData = JSON.parse(configData);
      setConfig(configData);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load theme preview.");
    } finally {
      setLoading(false);
    }
  };

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
          Preview Unavailable
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        <button
          onClick={loadTheme}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
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
        <PreviewBanner themeName={theme?.name} slug={themeSlug} />
      )}

      {/*
        CRITICAL: No wrapper div around sections.
        sticky position: sticky on the header only works when it is a direct
        child of the document scroll container (body / html).
        Any intermediate div with overflow, transform, or its own height
        will break sticky. So we render sections as siblings at the top level.
      */}
      {sections.length === 0 ? (
        <EmptyState />
      ) : (
        sections.map((section) => (
          // The id goes on the SectionRenderer's own root element via a wrapper
          // that does NOT interfere with sticky. We use a fragment-like approach:
          // give each section an anchor target via an invisible zero-height div
          // placed just before it, so #section-id scroll-links still work.
          <SectionAnchor key={section.id} id={section.id}>
            <SectionRenderer
              section={section}
              themeColors={themeColors}
              isPreview={true}
            />
          </SectionAnchor>
        ))
      )}
    </>
  );
}

/**
 * Renders an invisible anchor point for #hash navigation,
 * then the section content as a sibling — NOT a child.
 * This preserves sticky positioning on headers.
 */
function SectionAnchor({ id, children }) {
  const isHeader = id?.startsWith("header") || false;

  // For the header section, render with no wrapper at all so sticky works.
  if (isHeader) {
    return children;
  }

  // For all other sections, a normal div wrapper is fine.
  return <div id={id}>{children}</div>;
}

function PreviewBanner({ themeName, slug }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] flex items-center justify-between px-5 py-2.5 text-white text-sm shadow-lg"
      style={{ backgroundColor: "#4f46e5" }}
    >
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse flex-shrink-0" />
        <span className="font-semibold tracking-tight">Preview Mode</span>
        {themeName && (
          <>
            <span className="opacity-40 select-none">·</span>
            <span className="opacity-85 truncate max-w-[200px]">
              {themeName}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {slug && (
          <span className="hidden sm:inline text-xs opacity-60 font-mono">
            /t/{slug}
          </span>
        )}
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
