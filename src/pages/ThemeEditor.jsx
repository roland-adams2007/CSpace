import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Save,
  Eye,
  Undo,
  Redo,
  Settings,
  X,
  Loader2,
  Layout,
  Columns,
  Grid,
  Menu,
} from "lucide-react";
import { useThemeStore } from "../store/store";
import { useEditorStore } from "../store/store";
import SectionLibrary from "../components/ui/theme/SectionLibrary";
import Canvas from "../components/ui/theme/Canvas";
import PropertiesPanel from "../components/ui/theme/PropertiesPanel";
import { createNewSection, SECTION_LIBRARY } from "../utils/sectionLibrary";

const TEMPLATE_STRUCTURES = {
  classic: {
    name: "Classic",
    description: "Traditional single-column layout with centered content",
    icon: Layout,
    structure: [
      {
        id: "template-hero-classic",
        type: "hero",
        templateId: "hero-1",
        props: {
          heading: "Welcome to Our Platform",
          subheading: "Build amazing websites in minutes",
          ctaText: "Get Started",
          ctaLink: "#",
          alignment: "center",
          image: "",
        },
        style: {
          padding: { top: "6rem", bottom: "6rem" },
          backgroundType: "gradient",
          backgroundGradient:
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        },
      },
      {
        id: "template-features-classic",
        type: "features",
        templateId: "features-grid",
        props: {
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
        style: {
          padding: { top: "4rem", bottom: "4rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-content-classic",
        type: "content",
        templateId: "content-image",
        props: {
          heading: "About Us",
          content:
            "<p>We are a team of passionate developers building tools that make web development accessible to everyone. Our platform empowers creators to build beautiful websites without code.</p>",
          image: "",
          imagePosition: "right",
        },
        style: {
          padding: { top: "4rem", bottom: "4rem" },
          backgroundType: "color",
          backgroundColor: "#f9fafb",
        },
      },
      {
        id: "template-cta-classic",
        type: "cta",
        templateId: "cta-simple",
        props: {
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
        },
        style: {
          padding: { top: "6rem", bottom: "6rem" },
          backgroundType: "gradient",
          backgroundGradient:
            "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        },
      },
    ],
  },
  modern: {
    name: "Modern",
    description: "Asymmetric layout with bold designs and side elements",
    icon: Columns,
    structure: [
      {
        id: "template-hero-modern",
        type: "hero",
        templateId: "hero-2",
        props: {
          heading: "Build Your Dream Website",
          subheading: "Professional tools for modern creators",
          ctaText: "Start Free Trial",
          ctaLink: "#",
          image: "",
          alignment: "left",
        },
        style: {
          padding: { top: "8rem", bottom: "8rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-features-modern",
        type: "features",
        templateId: "features-list",
        props: {
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
            {
              id: "f3",
              icon: "check-circle",
              title: "Flexible",
              description: "Customize every aspect of your site",
            },
          ],
          columns: 2,
        },
        style: {
          padding: { top: "5rem", bottom: "5rem" },
          backgroundType: "color",
          backgroundColor: "#f8fafc",
        },
      },
      {
        id: "template-testimonials-modern",
        type: "testimonials",
        templateId: "testimonials-slider",
        props: {
          heading: "What Our Customers Say",
          testimonials: [
            {
              id: "t1",
              name: "Sarah Johnson",
              role: "Creative Director",
              content:
                "This platform transformed how we build client websites. The flexibility is incredible!",
              avatar: "",
              rating: 5,
            },
            {
              id: "t2",
              name: "Michael Chen",
              role: "Startup Founder",
              content:
                "Saved us months of development time. Highly recommended for any business.",
              avatar: "",
              rating: 5,
            },
          ],
        },
        style: {
          padding: { top: "5rem", bottom: "5rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-pricing-modern",
        type: "pricing",
        templateId: "pricing-table",
        props: {
          heading: "Simple, Transparent Pricing",
          subheading: "Choose the plan that's right for you",
          plans: [
            {
              id: "p1",
              name: "Starter",
              price: "$19",
              period: "month",
              features: ["Basic Features", "5 Projects", "Email Support"],
              ctaText: "Get Started",
              ctaLink: "#",
              highlighted: false,
            },
            {
              id: "p2",
              name: "Pro",
              price: "$49",
              period: "month",
              features: [
                "All Features",
                "Unlimited Projects",
                "Priority Support",
                "Custom Domain",
              ],
              ctaText: "Try Free",
              ctaLink: "#",
              highlighted: true,
            },
            {
              id: "p3",
              name: "Enterprise",
              price: "$99",
              period: "month",
              features: [
                "Pro Features",
                "White Label",
                "Dedicated Support",
                "API Access",
              ],
              ctaText: "Contact Sales",
              ctaLink: "#",
              highlighted: false,
            },
          ],
        },
        style: {
          padding: { top: "5rem", bottom: "5rem" },
          backgroundType: "color",
          backgroundColor: "#f8fafc",
        },
      },
    ],
  },
  minimal: {
    name: "Minimal",
    description: "Clean, spacious layout with focus on content",
    icon: Grid,
    structure: [
      {
        id: "template-hero-minimal",
        type: "hero",
        templateId: "hero-1",
        props: {
          heading: "Simple. Beautiful. Effective.",
          subheading: "A clean approach to website building",
          ctaText: "Explore Features",
          ctaLink: "#",
          alignment: "center",
          image: "",
        },
        style: {
          padding: { top: "10rem", bottom: "10rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-content-minimal",
        type: "content",
        templateId: "content-text",
        props: {
          heading: "Our Philosophy",
          content:
            "<p>We believe in minimalism and purpose. Every element should serve a function, and every design should enhance the content.</p><p>Our platform reflects this philosophy by providing clean, focused tools that help you communicate effectively.</p>",
          alignment: "center",
          image: "",
          imagePosition: "right",
        },
        style: {
          padding: { top: "6rem", bottom: "6rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-features-minimal",
        type: "features",
        templateId: "features-grid",
        props: {
          heading: "Core Principles",
          subheading: "What guides our design",
          features: [
            {
              id: "f1",
              icon: "eye",
              title: "Clarity",
              description: "Clear communication above all",
            },
            {
              id: "f2",
              icon: "target",
              title: "Purpose",
              description: "Every element has a reason",
            },
            {
              id: "f3",
              icon: "feather",
              title: "Simplicity",
              description: "Less is more, always",
            },
            {
              id: "f4",
              icon: "zap",
              title: "Efficiency",
              description: "Fast and streamlined",
            },
          ],
          columns: 4,
        },
        style: {
          padding: { top: "6rem", bottom: "6rem" },
          backgroundType: "color",
          backgroundColor: "#fafafa",
        },
      },
      {
        id: "template-contact-minimal",
        type: "contact",
        templateId: "contact-form",
        props: {
          heading: "Get in Touch",
          subheading: "We'd love to hear from you",
          fields: [
            { id: "name", type: "text", label: "Name", required: true },
            { id: "email", type: "email", label: "Email", required: true },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              required: true,
            },
          ],
          submitText: "Send Message",
        },
        style: {
          padding: { top: "6rem", bottom: "6rem" },
          backgroundType: "color",
          backgroundColor: "#ffffff",
        },
      },
      {
        id: "template-cta-minimal",
        type: "cta",
        templateId: "cta-simple",
        props: {
          heading: "Ready to Begin?",
          subheading: "Start building your minimalist website today",
          primaryButton: {
            text: "Get Started",
            link: "#",
          },
          secondaryButton: {
            text: "View Examples",
            link: "#",
          },
        },
        style: {
          padding: { top: "8rem", bottom: "8rem" },
          backgroundType: "color",
          backgroundColor: "#000000",
        },
      },
    ],
  },
};

const SkeletonLoader = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse hidden sm:block"></div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0 border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
            <div className="h-12 border-b border-gray-200 bg-gray-50"></div>
            <div className="p-8 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-80 flex-shrink-0 border-l border-gray-200 p-6">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ThemeEditor() {
  const { themeSlug } = useParams();
  const navigate = useNavigate();
  const { getTheme, updateTheme, loading } = useThemeStore();
  const {
    config,
    setConfig,
    addSection,
    undo,
    redo,
    canUndo,
    canRedo,
    isDirty,
    resetDirty,
  } = useEditorStore();

  const [theme, setTheme] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, [themeSlug]);

  const loadTheme = async () => {
    try {
      const themeData = await getTheme(themeSlug);
      setTheme(themeData);

      let configData = themeData.config_json;
      if (typeof configData === "string") {
        configData = JSON.parse(configData);
      }

      setConfig(configData);

      if (configData.template) {
        setSelectedTemplate(configData.template);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
      navigate("/website-builder");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedConfig = {
        ...config,
        template: selectedTemplate,
      };

      await updateTheme(theme.id, {
        config_json: JSON.stringify(updatedConfig),
        name: theme.name,
      });
      setConfig(updatedConfig);
      resetDirty();
    } catch (error) {
      console.error("Failed to save theme:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = (libraryItem) => {
    const newSection = createNewSection(libraryItem);
    addSection(newSection);
  };

  const handlePreview = () => {
    const currentConfig = {
      ...config,
      template: selectedTemplate,
      previewMode: true,
    };

    useEditorStore.getState().setConfig(currentConfig);

    if (isDirty) {
      if (confirm("You have unsaved changes. Save before previewing?")) {
        handleSave().then(() => {
          window.open(
            `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
            "_blank",
          );
        });
      } else {
        window.open(
          `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
          "_blank",
        );
      }
    } else {
      window.open(
        `${import.meta.env.VITE_APP_URL}/t/${themeSlug}?preview=true`,
        "_blank",
      );
    }
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/website-builder");
      }
    } else {
      navigate("/website-builder");
    }
  };

  const applyTemplate = (templateName) => {
    if (config.layout.sections.length > 0) {
      if (
        !confirm(
          "Applying a new template will replace your current layout. Continue?",
        )
      ) {
        return;
      }
    }

    setSelectedTemplate(templateName);
    setShowTemplateModal(false);

    const template = TEMPLATE_STRUCTURES[templateName];
    const newSections = template.structure.map((section) => ({
      ...section,
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    const newConfig = {
      ...config,
      template: templateName,
      layout: {
        ...config.layout,
        sections: newSections,
      },
    };

    useEditorStore.getState().setConfig(newConfig);
    useEditorStore.getState().resetDirty();
  };

  const openTemplateModal = () => {
    setShowTemplateModal(true);
  };

  if (isLoading || loading || !theme) {
    return <SkeletonLoader />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close editor"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {theme.name}
            </h1>
            <p className="text-xs text-gray-500">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={openTemplateModal}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Change Template</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`p-2 rounded-lg transition-colors ${
                canUndo()
                  ? "hover:bg-white text-gray-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`p-2 rounded-lg transition-colors ${
                canRedo()
                  ? "hover:bg-white text-gray-700"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={handlePreview}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isDirty && !saving
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {saving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 flex-shrink-0">
          <SectionLibrary onAddSection={handleAddSection} />
        </div>

        <div className="flex-1 overflow-hidden">
          <Canvas selectedTemplate={selectedTemplate} />
        </div>

        <div className="w-80 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Choose a Template
                </h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Select a template to apply to your website. This will replace
                your current layout.
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(TEMPLATE_STRUCTURES).map(([key, template]) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => applyTemplate(key)}
                      className={`border-2 rounded-lg p-6 text-left transition-all hover:shadow-lg ${
                        selectedTemplate === key
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`p-3 rounded-lg ${
                            selectedTemplate === key
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {template.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Current:{" "}
                            {selectedTemplate === key ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {template.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {template.structure.length} sections •{" "}
                        {
                          template.structure.filter((s) => s.type === "hero")
                            .length
                        }{" "}
                        hero •{" "}
                        {
                          template.structure.filter(
                            (s) => s.type === "features",
                          ).length
                        }{" "}
                        features
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Current Template:{" "}
                  {TEMPLATE_STRUCTURES[selectedTemplate]?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  You have {config.layout.sections.length} sections in your
                  current layout.
                  {config.layout.sections.length > 0 && (
                    <span className="text-amber-600 font-medium">
                      {" "}
                      Warning: Applying a new template will replace all current
                      sections.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Theme Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={theme.name}
                    onChange={(e) =>
                      setTheme({ ...theme, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={theme.description || ""}
                    onChange={(e) =>
                      setTheme({ ...theme, description: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Theme Colors
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={config.theme.colors.primary}
                        onChange={(e) =>
                          useEditorStore
                            .getState()
                            .updateConfig(
                              "theme.colors.primary",
                              e.target.value,
                            )
                        }
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={config.theme.colors.secondary}
                        onChange={(e) =>
                          useEditorStore
                            .getState()
                            .updateConfig(
                              "theme.colors.secondary",
                              e.target.value,
                            )
                        }
                        className="w-full h-10 rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    setShowSettings(false);
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
