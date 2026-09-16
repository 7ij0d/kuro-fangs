import { useSearchParams } from "react-router-dom";

export function clearCatalogMaterialsCache() {}

export function useCatalogMaterials(user) {
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title") || "Local Sheet";

  return {
    materials: [{
      slug: "local",
      sheets: [{
        slug: "local-sheet",
        title: title,
        pdfUrl: searchParams.get("pdf_url") || "/sample.pdf"
      }]
    }],
    loading: false,
    error: "",
    reload: () => {}
  };
}
