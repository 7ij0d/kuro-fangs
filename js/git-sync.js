/**
 * KURO FANGS — GITHUB REPOSITORY SYNC & GLOBAL PUBLISHING ENGINE
 * Enables the Administrator to directly commit updated academic sheets
 * to the GitHub repository ('7ij0d/kuro-fangs') via the GitHub REST API.
 * This guarantees 100% global multi-device persistence on GitHub Pages without external databases.
 */

(function () {
  const GITHUB_REPO_OWNER = '7ij0d';
  const GITHUB_REPO_NAME = 'kuro-fangs';
  const GITHUB_SHEETS_PATH = 'data/sheets.json';
  const GITHUB_BRANCH = 'main';

  const KuroGitSync = {
    getRepoInfo() {
      return {
        owner: GITHUB_REPO_OWNER,
        repo: GITHUB_REPO_NAME,
        path: GITHUB_SHEETS_PATH,
        branch: GITHUB_BRANCH
      };
    },

    getToken() {
      try {
        return localStorage.getItem('kf_github_pat') || '';
      } catch (e) {
        return '';
      }
    },

    saveToken(token) {
      if (!token) return;
      localStorage.setItem('kf_github_pat', token.trim());
    },

    clearToken() {
      localStorage.removeItem('kf_github_pat');
    },

    hasToken() {
      return Boolean(this.getToken());
    },

    /**
     * Test GitHub Token permissions on the kuro-fangs repository
     * @param {string} [tokenOverride]
     * @returns {Promise<{success: boolean, user?: string, repoName?: string, error?: string}>}
     */
    async testToken(tokenOverride) {
      const token = tokenOverride || this.getToken();
      if (!token) {
        return { success: false, error: 'لم يتم إدخال رمز الوصول (Token)' };
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (res.status === 200) {
          const data = await res.json();
          return {
            success: true,
            repoName: data.full_name,
            permissions: data.permissions
          };
        } else if (res.status === 401) {
          return { success: false, error: 'الرمز غير صالح أو منتهي الصلاحية (Bad credentials)' };
        } else if (res.status === 404) {
          return { success: false, error: 'تعذر الوصول للمستودع. تأكد أن الرمز لديه صلاحية repo' };
        } else {
          return { success: false, error: `GitHub API returned status ${res.status}` };
        }
      } catch (e) {
        return { success: false, error: 'خطأ في الاتصال بشبكة الإنترنت أو GitHub API' };
      }
    },

    /**
     * Commit updated sheets array directly to data/sheets.json on GitHub
     * @param {Array} sheetsArray
     * @param {string} [customMessage]
     * @returns {Promise<{success: boolean, commitSha?: string, commitUrl?: string, error?: string}>}
     */
    async commitSheets(sheetsArray, customMessage) {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: 'GitHub Personal Access Token not configured' };
      }

      const sheets = Array.isArray(sheetsArray) ? sheetsArray : [];
      const jsonContent = JSON.stringify({ sheets }, null, 2) + '\n';

      try {
        // 1. Get current file SHA from GitHub
        let currentSha = null;
        try {
          const getRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_SHEETS_PATH}?ref=${GITHUB_BRANCH}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );
          if (getRes.status === 200) {
            const fileData = await getRes.json();
            currentSha = fileData.sha;
          }
        } catch (err) {
          console.warn('Could not fetch existing sheets.json sha, attempting create:', err);
        }

        // 2. Base64 encode the UTF-8 JSON string safely
        const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

        // 3. Commit the updated file to GitHub main branch
        const commitMsg = customMessage || `chore(sheets): update sheets catalog via Admin Portal [${new Date().toISOString().split('T')[0]}]`;

        const putBody = {
          message: commitMsg,
          content: base64Content,
          branch: GITHUB_BRANCH
        };
        if (currentSha) {
          putBody.sha = currentSha;
        }

        const putRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_SHEETS_PATH}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(putBody)
          }
        );

        if (putRes.status === 200 || putRes.status === 201) {
          const commitData = await putRes.json();
          return {
            success: true,
            commitSha: commitData.commit?.sha,
            commitUrl: commitData.commit?.html_url
          };
        } else {
          const errorData = await putRes.json().catch(() => ({}));
          return {
            success: false,
            error: errorData.message || `GitHub commit failed with status ${putRes.status}`
          };
        }
      } catch (err) {
        return { success: false, error: err.message || 'Network exception during GitHub commit' };
      }
    },

    /**
     * Download updated sheets.json directly to administrator's computer
     * @param {Array} sheetsArray
     */
    downloadSheetsJson(sheetsArray) {
      const sheets = Array.isArray(sheetsArray) 
        ? sheetsArray 
        : (window.DATA?.sheets || []);
      
      const jsonContent = JSON.stringify({ sheets }, null, 2) + '\n';
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sheets.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    }
  };

  window.KuroGitSync = KuroGitSync;
})();
