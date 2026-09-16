# PDF Viewer — حزمة التسليم لمطوّر خارجي

عارض الـPDF في هذا المشروع اسمه داخليًا **Focus Workspace / Catalog Workspace**.
الملف الرئيسي هو `frontend/src/pages/CatalogFocusWorkspace.jsx` (4191 سطرًا) وهو
يحتوي على الـstate، الـtoolbar، نظام اللمس والزوم، وكل ربط الأدوات.
باقي المنطق مقسّم تحت `frontend/src/workspace/`.

> ملاحظة مهمة: لا توجد في المشروع أداة **Laser / Pointer**، ولا Fabric.js ولا Konva
> ولا pdf-lib ولا react-pdf. الرسم كله مكتوب يدويًا على Canvas فوق صفحات PDF.js.

---

## 1. الملفات الأساسية (Core)

| المسار | الوظيفة |
|---|---|
| `frontend/src/pages/CatalogFocusWorkspace.jsx` | **قلب العارض.** كل الـstate (الملف الحالي، الصفحة، الزوم، الأداة، اللون، الحجم، وضع القراءة، التحديد، الملاحظات، الـtoolbar، loading/error)، معالجات Pointer/Touch/Wheel/Keyboard، Undo/Redo، Import/Export، وواجهة الـUI كاملة. |
| `frontend/src/pages/catalog-focus-workspace.css` | كل ستايلات العارض: Toolbar، أزرار الأدوات، Color Picker، Brush size، Page counter، القوائم المنبثقة، وتجاوبات الموبايل/التابلت/الديسكتوب. |
| `frontend/src/workspace/config.js` | ثوابت مشتركة: حدود الزوم (min 0.5 / max 5)، حساسية عجلة الماوس، عتبات الإيماءات، حدود الرندر. |

## 2. عرض الـPDF ونظام الصفحات

| المسار | الوظيفة |
|---|---|
| `frontend/src/workspace/catalog/ContinuousA4Pdf.jsx` | المكوّن الذي يفتح ملف الـPDF ويرسم الصفحات بشكل متواصل (continuous scroll) على Canvas، مع Virtualization وLazy rendering وحالات Loading/Error. يصدّر `A4_PAGE_WIDTH`. |
| `frontend/src/workspace/catalog/pdfJsAdapter.js` | الغلاف الوحيد حول **PDF.js**: يحمّل `pdfjs-dist/legacy` ويضبط الـworker عبر `?url`. أي ترقية لـPDF.js تبدأ من هنا. |
| `frontend/src/workspace/catalog/pdfRenderQueue.js` | طابور أولويات لعمليات الرندر الثقيلة حتى تُرسم الصفحة الظاهرة أولًا، مع إلغاء الأجيال القديمة. |
| `frontend/src/workspace/catalog/renderBudget.js` | حساب ميزانية البكسل للـcanvas (`catalogCanvasPixelBudget`, `inkCanvasOutputScale`) لمنع استهلاك ذاكرة مفرط على الأجهزة الضعيفة. |
| `frontend/src/workspace/catalog/visiblePdfPages.js` | تحديد نطاق الصفحات المرئية حاليًا (أساس الـvirtualization). |
| `frontend/src/workspace/catalog/workspacePerformance.js` | مراقب الأداء (FPS / أطر الرسم) الذي يخفّض الجودة تلقائيًا عند الضغط. |

## 3. الزوم والإحداثيات واللمس

| المسار | الوظيفة |
|---|---|
| `frontend/src/workspace/document/coordinateTransforms.js` | **أهم ملف بعد الرئيسي.** تحويل إحداثيات الشاشة ↔ إحداثيات الصفحة، `fitWidthZoom`، `continuousPinchScale`، `livePinchTransform`، `zoomScrollForAnchor` (الحفاظ على موضع المستخدم أثناء الزوم)، حدود التمرير، نسبة أبعاد الصفحة. |
| `frontend/src/workspace/input/gestureStateMachine.js` | آلة حالات الإدخال: هل هذا إصبع أم Apple Pencil أم ماوس، هل يُسمح بالرسم (`pointerCanDraw`)، كشف لمس الكف (`suspiciousPalmContact`)، اتجاه الإيماءة وقفل الاتجاه — أي منع التعارض بين القلم واللمس. |
| `frontend/src/workspace/input/elasticGesture.js` | السلوك المطاطي (rubber-band) عند تجاوز حدود التمرير أو الزوم، مع نوابض. |
| `frontend/src/workspace/input/scrollMomentum.js` | القصور الذاتي للتمرير بعد رفع الإصبع (momentum / fling). |
| `frontend/src/lib/viewport.js` | **سلطة الـviewport الوحيدة في الموقع.** يفرّق بين الـlarge viewport وVisualViewport (Safari/iPad/الكيبورد). إطار إحداثيات الـPDF يعتمد عليه. مشترك مع باقي الموقع. |

## 4. الحبر والأدوات (قلم / هايلايتر / ممحاة / أشكال)

| المسار | الوظيفة |
|---|---|
| `frontend/src/workspace/ink/strokeModel.js` | نموذج الضربة: `PEN_PROFILE` (القلم والهايلايتر وشفافيته)، `ERASER_MODE`، الضغط (pressure) من Apple Pencil، التنعيم، هندسة الرسم، تغطية المسح. |
| `frontend/src/workspace/ink/LiveAnnotationCanvas.jsx` | الـCanvas الشفاف فوق صفحات الـPDF الذي يرسم الضربة الجارية والـannotations المحفوظة. |
| `frontend/src/workspace/ink/liveStrokeGeometry.js` | هندسة تدريجية للضربة أثناء الرسم (بدون إعادة حساب كامل كل frame). |
| `frontend/src/workspace/ink/inkInputController.js` | تطبيع عيّنات الـPointer: المسافة الدنيا، الاستيفاء بين النقاط، `getCoalescedEvents`. |
| `frontend/src/workspace/ink/inkGestureRecognition.js` | تحويل الضربة إلى شكل (Shape recognition)، الشخبطة للحذف، اللاسو المستطيل، الضربة المثبّتة. |
| `frontend/src/workspace/ink/eraserSession.js` | جلسة المسح: تقاطع مسار الممحاة مع الضربات وقصّها. |
| `frontend/src/workspace/catalog/toolPalette.js` | ألوان الأدوات والألوان المحفوظة (`addSavedColor` / `removeSavedColor` / التطبيع). |

## 5. الـAnnotations والحالة والحفظ

| المسار | الوظيفة |
|---|---|
| `frontend/src/workspace/catalog/catalogWorkspaceState.js` | نموذج بيانات مساحة العمل: إنشاء/تعديل/تحريك/تدوير/تغيير حجم/حذف annotation، الفهرس المكاني (spatial index)، حدود العناصر، التسلسل/التفكيك، وحدود 5000 annotation و500 ملاحظة. |
| `frontend/src/workspace/storage/annotationStore.js` | مخزن الـannotations لكل صفحة + التنظيف وإصدارات السجلات. |
| `frontend/src/workspace/storage/workspaceSnapshot.js` | لقطة مساحة العمل: التجميع حسب الصفحة، بصمات الصفحات، دمج المستعاد، أسماء ملفات التصدير، تحليل ملف الاستيراد، مفاتيح التخزين لكل مستخدم. |
| `frontend/src/workspace/catalog/catalogServerSync.js` | المزامنة مع الخادم: autosave، revisions، idempotency، حل التعارضات، الطابور عند انقطاع الاتصال. |
| `frontend/src/workspace/catalog/focusAnnotationAdapter.js` | تحويل شكل الـannotation بين الواجهة والخادم. |

## 6. الـHooks والـAPI

| المسار | الوظيفة |
|---|---|
| `frontend/src/hooks/useCatalogDocument.js` | جلب المستند الحالي (رابط الـPDF + معرّفه). |
| `frontend/src/hooks/useCatalogMaterials.js` | قائمة المواد والأوراق للتنقل داخل العارض. |
| `frontend/src/hooks/useAsyncData.js` | hook عام لحالات loading/error. |
| `frontend/src/hooks/usePageTitle.js` | عنوان الصفحة. |
| `frontend/src/api/catalogWorkspace.js` | نقاط النهاية: `resolve` للمستند، و`get`/`probe`/`save` لمساحة العمل. |
| `frontend/src/api/focus.js` | جلسات التركيز والإشارات المرجعية المرتبطة بالعارض. |
| `frontend/src/api/progress.js` | حفظ التقدّم / آخر صفحة. |
| `frontend/src/api/client.js` | طبقة HTTP: المصادقة، إعادة المحاولة، الطابور دون اتصال، الأخطاء. **مشترك.** |
| `frontend/src/api/pagination.js` | `generateIdempotencyKey` و`buildQueryString`. **مشترك.** |
| `frontend/src/api/contracts.js` | تطبيع الردود المقسّمة صفحات. **مشترك.** |
| `frontend/src/lib/materialCatalog.js` | `resolveSheetEdition` و`withEditionPdfUrl` — تحديد أي ملف PDF يُفتح، وتذكّر آخر ورقة. |
| `frontend/src/lib/connectionState.js` | حالة الاتصال (online/offline) المستخدَمة للـautosave. |

## 7. Shared Dependencies (مشتركة مع باقي الموقع — لا تحذفها)

هذه الملفات يستعملها العارض ويستعملها باقي الموقع أيضًا. أُرسلت لأن العارض لا يعمل بدونها:

- `frontend/src/lib/utils.js` — `cssVars` و`assetPath` (الأخير يبني رابط الـPDF الفعلي).
- `frontend/src/lib/constants.js` — ثوابت يستعملها `utils.js`.
- `frontend/src/lib/errors.js` — تطبيع رسائل الخطأ.
- `frontend/src/lib/i18n.js` — كل الترجمات (ملف كبير جدًا؛ نصوص العارض بداخله).
- `frontend/src/components/I18nProvider.jsx` — مزوّد الترجمة واتجاه RTL/LTR.
- `frontend/src/components/ui/index.jsx` + `interactive.jsx` — `Page`, `LoadingPanel`, `ErrorPanel`, `EmptyState` وعناصر تفاعلية.
- `frontend/src/lib/icons.jsx`, `frontend/src/lib/lockinIcons.jsx`, `frontend/src/lib/routeMetadata.js` — تبعيات مكوّنات الـUI أعلاه.
- `frontend/src/styles.css`, `frontend/src/responsive.css` — التوكنات العامة (ألوان، مسافات، نقاط التجاوب). `responsive.css` يحتوي فعليًا قواعد `pdf-workspace-*` و`pdf-canvas-viewer-container`.
- `frontend/src/lib/viewport.js` — مذكور أعلاه؛ مشترك لكنه حرج للعارض.

## 8. ملفات الإعداد

- `frontend/package.json` — التبعيات (انظر القسم 9).
- `frontend/vite.config.js` — Vite + PWA؛ مهم لأن worker الـPDF.js يُحمّل عبر `?url`.
- `frontend/tailwind.config.cjs`, `frontend/postcss.config.cjs`, `frontend/index.html`.

## 9. المكتبات المطلوبة

- **`pdfjs-dist` 6.3.289** — المحرك الوحيد للعرض. مستخدَم فعليًا في `pdfJsAdapter.js` فقط.
- **React 18 + react-router-dom** — `CatalogFocusWorkspace.jsx` وباقي المكوّنات.
- **lucide-react** — كل أيقونات الـtoolbar.
- **Tailwind CSS + PostCSS** — الستايل.
- **Vite** — البناء وتحميل الـworker.
- **Vitest + Playwright** — الاختبارات المرفقة.

لا يوجد: Fabric.js، Konva، pdf-lib، react-pdf، ولا أي مكتبة إيماءات (Hammer / use-gesture) — الإيماءات مكتوبة يدويًا في `workspace/input/`.
إدارة الحالة: `useState` / `useReducer` / `useRef` + stores مكتوبة يدويًا. **لا Redux ولا Zustand ولا Context خاص بالعارض.**

## 10. الخادم (Backend — للمرجع فقط)

| المسار | الوظيفة |
|---|---|
| `backend/apps/content/urls.py` | مسارات `catalog/documents/...` و`catalog/materials`. |
| `backend/apps/content/views.py` | `CatalogDocumentResolveView` و`CatalogWorkspaceView` (GET/PATCH مع revision + idempotency + قفل التعارض). |
| `backend/apps/content/models.py` | `CatalogDocument`, `CatalogWorkspaceSnapshot`, `CatalogWorkspaceReceipt`. |
| `backend/apps/content/serializers.py`, `editions.py` | التسلسل واختيار نسخة الـPDF. |

## 11. الاختبارات المرفقة

Vitest: `tests/focus-workspace-engine.test.js`, `focus-workspace-live-ink.test.js`,
`catalog-focus-sync.test.js`, `workspace-storage.test.js`, `tool-palette.test.js`,
`pdfjs-upgrade.test.js`, `viewport-stabilization.test.js`.

Playwright: `e2e/focus-workspace*.spec.js`, `focus-pinch-zoom.spec.js`,
`focus-pdf-recovery.spec.js`, `pdf-range-requests.spec.js`, `catalog-server-sync.spec.js`.

## 12. ما يحتاج المطوّر معرفته خارج هذه الملفات

1. **ملفات الـPDF نفسها غير مرفقة** — تُقدَّم من الخادم عبر `assetPath(pdfUrl)`؛ يحتاج رابطًا أو ملف اختبار محلي.
2. **المصادقة** — `api/client.js` يتوقّع جلسة مسجّلة الدخول؛ بدون خادم يجب عمل mock للدالة `request`.
3. **`node_modules` غير مرفق** — `pnpm install` داخل `frontend/`.
4. **العارض يُركَّب عبر Router** — المسار معرّف في `src/App.jsx` (غير مرفق لأنه يخص التوجيه العام). للتشغيل المعزول: ركّب `CatalogFocusWorkspace` داخل `I18nProvider` + `MemoryRouter`.
5. **`src/main.jsx` غير مرفق** لكنه هو الذي يستورد `styles.css` و`responsive.css`.
6. **Service Worker / PWA** في `vite.config.js` قد يخزّن الـPDF مؤقتًا أثناء التطوير.
