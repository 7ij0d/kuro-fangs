export const apiClient = {};
export function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  console.log("[Offline Mock] request", method, path, options);

  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock CSRF
      if (path.includes("/auth/csrf")) return resolve({ csrf_token: "mock-token" });

      // Mock Workspace State
      if (path.includes("/workspace")) {
        if (method === "GET") {
          const state = localStorage.getItem("workspace_" + path);
          return resolve(state ? JSON.parse(state) : { state: {} });
        }
        if (method === "PATCH" || method === "POST") {
          localStorage.setItem("workspace_" + path, JSON.stringify(options.body));
          return resolve({ success: true, revision: Date.now() });
        }
      }

      // Mock Annotations
      if (path.includes("/annotations")) {
        if (method === "GET") {
          const stored = localStorage.getItem("annotations_" + path.split("?")[0]);
          return resolve(stored ? JSON.parse(stored) : { results: [], collection_revision: 0 });
        }
        if (method === "POST") {
          const stored = localStorage.getItem("annotations_" + path) || '{"results":[]}';
          const data = JSON.parse(stored);
          const { annotations = [], deleted_ids = [] } = options.body;
          
          let results = data.results.filter(a => !deleted_ids.includes(a.client_id));
          annotations.forEach(a => {
            const idx = results.findIndex(x => x.client_id === a.client_id);
            if (idx >= 0) results[idx] = a;
            else results.push(a);
          });
          
          localStorage.setItem("annotations_" + path, JSON.stringify({ results, collection_revision: Date.now() }));
          return resolve({ success: true, collection_revision: Date.now() });
        }
      }

      // Default mock
      resolve({});
    }, 50);
  });
}
export function onUnauthorized() {}
export function setSessionMarker() {}
export function clearCsrfToken() {}
export function isApiError() { return false; }
export class ApiError extends Error {}
