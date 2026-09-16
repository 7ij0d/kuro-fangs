import { useSearchParams } from "react-router-dom";

export function clearCatalogMaterialsCache() {}

export function useCatalogMaterials(user) {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Local Sheet";
  const pdfUrl = searchParams.get("pdf_url") || "";
  const materialSlug = searchParams.get("material_slug") || "local";
  const sheetSlug = searchParams.get("sheet_slug") || "local-sheet";

  return {
    materials: [{
      slug: materialSlug,
      title: "Local Material",
      sheets: [{
        slug: sheetSlug,
        title,
        title_ar: title,
        title_en: title,
        pdfUrl,
        pageCount: null,
        hasActiveStudy: false,
        deliverable: { type: "pdf", pdfUrl }
      }]
    }],
    loading: false,
    error: "",
    reload: () => {}
  };
}
