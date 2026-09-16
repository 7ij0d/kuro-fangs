import { useSearchParams } from "react-router-dom";

export function clearCatalogMaterialsCache() {}

export function useCatalogMaterials(user) {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Local Sheet";
  const pdfUrl = searchParams.get("pdf_url") || "";
  const materialSlug = searchParams.get("material_slug") || "local";
  const sheetSlug = searchParams.get("sheet_slug") || "local-sheet";

  const sheet = {
    slug: sheetSlug,
    title,
    title_ar: title,
    title_en: title,
    pdfUrl,           // used by resolveSheetEdition when published=false
    pageCount: null,
    hasActiveStudy: false,
    // editions = undefined so published=false, slug used as edition slug
    deliverable: { type: "pdf", pdfUrl }
  };

  return {
    materials: [{
      slug: materialSlug,
      title: "Local Material",
      sheets: [sheet]
    }],
    loading: false,
    error: "",
    reload: () => {}
  };
}
