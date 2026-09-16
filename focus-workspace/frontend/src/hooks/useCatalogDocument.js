import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useCatalogDocument(materialSlug, sheetSlug) {
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get("pdf_url") || "/sample.pdf";
  const id = searchParams.get("sheet_id") || "local-sheet-123";

  return {
    document: { id, versionId: id, viewUrl: pdfUrl, checksum: "local" },
    loading: false,
    error: null,
    reload: () => {}
  };
}
