## [2.0.1](https://github.com/NickSalA/pactus-frontend/compare/v2.0.0...v2.0.1) (2026-05-26)


### Bug Fixes

* Fixed incorrect redirection ([415707a](https://github.com/NickSalA/pactus-frontend/commit/415707a3605fc4c5f5c13341f772da32a7b449a8))

# [2.0.0](https://github.com/NickSalA/pactus-frontend/compare/v1.0.1...v2.0.0) (2026-05-26)


* BREAKING CHANGE: Merge pull request [#7](https://github.com/NickSalA/pactus-frontend/issues/7) from NickSalA/developer ([6c70a2d](https://github.com/NickSalA/pactus-frontend/commit/6c70a2d794a1aa578420722b3506616c9b1555e9))


### Bug Fixes

* **contracts:** capture folder name at modal open to prevent display glitch ([6c4e7da](https://github.com/NickSalA/pactus-frontend/commit/6c4e7da1eea0a5c2dc6fa5255f2f1a1af2eeb294))
* **contracts:** remove optimistic folder navigation on create ([f185861](https://github.com/NickSalA/pactus-frontend/commit/f18586136d7d6ca1ccea520f97f9b70433011f47))
* Dashboard admin page removed from Sidebar ([289aff1](https://github.com/NickSalA/pactus-frontend/commit/289aff1bbad3db81b62c896a69fb564249299714))
* **dashboard:** fix alert center redirect based on user role ([4ac8873](https://github.com/NickSalA/pactus-frontend/commit/4ac8873b328f420329ed8cdfd6a0f8d7d805837c))
* **dashboard:** fix recent documents table redirect based on user role ([1e45b6f](https://github.com/NickSalA/pactus-frontend/commit/1e45b6fa4bf5bc3730ff393c30757b6b088e4fc1))
* **dashboard:** fixed visualization issues in chart components ([d69d531](https://github.com/NickSalA/pactus-frontend/commit/d69d531c2bcc671e36d46937718c8a2b9ac72ed8))
* **dashboard:** standardize string quotes and improve formatting in DashboardAlertCenter and DashboardAreaChart components ([c563e43](https://github.com/NickSalA/pactus-frontend/commit/c563e4303a6ff514aa06147fa6f9f3fb8713d154))
* gap styles in contracts actions bar ([e2e07a9](https://github.com/NickSalA/pactus-frontend/commit/e2e07a9743aea93dca1912b7cbc2a97e2dec7c01))
* improve styling for ContractsFolderTabs component to enhance layout and responsiveness ([cb8340a](https://github.com/NickSalA/pactus-frontend/commit/cb8340a77a7557b543f8c518337f7d9003515ebb))
* normalize folder tab height with consistent border sizing ([34090e9](https://github.com/NickSalA/pactus-frontend/commit/34090e95bbf81cfc5ae501aa95377b0d8c4fac88))
* removed old route to admin/dashboard to admin/access ([2e6bb3e](https://github.com/NickSalA/pactus-frontend/commit/2e6bb3e74e8f74023fe29af4af509ffbebbbe043))
* title updated ([3c9f877](https://github.com/NickSalA/pactus-frontend/commit/3c9f87747439946caed2972517b0f70fb14379af))
* **ui:** [SCRUM-34] update TextField props type and fix cn bug ([44ede2e](https://github.com/NickSalA/pactus-frontend/commit/44ede2e7b5fca8bb92fa1bff46e88cb935e03709))


### Features

* add admin organization setup flow ([ebf759f](https://github.com/NickSalA/pactus-frontend/commit/ebf759fd19c73421011349d6d1c9a2d39bc6a8d2))
* add Button component and apply to ChatHistorySidebar conversation buttons ([c548e3f](https://github.com/NickSalA/pactus-frontend/commit/c548e3f23606a58888fc1b9a2c91644cf6bdd213))
* add Button component with normal/emphasized variants ([a1228f1](https://github.com/NickSalA/pactus-frontend/commit/a1228f11dd6a1e4c1339832982a420ad0b778c9d))
* add chat components and hooks for AI agent functionality ([224e1ae](https://github.com/NickSalA/pactus-frontend/commit/224e1aea159573a9389ea733de0dcc28eca80c58))
* add chat components and hooks for AI agent interaction ([2bedb45](https://github.com/NickSalA/pactus-frontend/commit/2bedb4532d1e32fa73f2eec04a907bced1885676))
* add contract generation steps and components ([934a1ce](https://github.com/NickSalA/pactus-frontend/commit/934a1ce870efedf021a61dd2bfa4167dbc35cf74))
* add ContractsDriveSelection component for managing Google Drive file selections ([e01b0be](https://github.com/NickSalA/pactus-frontend/commit/e01b0be37247f944868346fb6ed178d362c3215e))
* add generateTemplateDraft mutation and integrate into TemplateFormModal and AdminTemplatesSection ([738d72a](https://github.com/NickSalA/pactus-frontend/commit/738d72a9491135f667ab9a4b7502fa2071967b6f))
* add hooks for contract management, including previews, filters, and drive picker ([8176464](https://github.com/NickSalA/pactus-frontend/commit/8176464929281444e7970e9adc2a391c5186853b))
* add normalization utilities for members, templates, documents, and draft requests; implement Google Drive file filtering ([1ab56f2](https://github.com/NickSalA/pactus-frontend/commit/1ab56f22dc1705d4b9df05b4f3827ec05003a613))
* add queryClient integration for template reload functionality in useAdminTemplates hook ([131e3de](https://github.com/NickSalA/pactus-frontend/commit/131e3de92ef8da57dfe59954058b0bbd2bfca310))
* add superadmin organization provisioning ([888dc48](https://github.com/NickSalA/pactus-frontend/commit/888dc48581e59634bed9df026b2ad0f97dad75f5))
* add TemplateSummaryAccordion, TemplateViewModal, TemplateWizardProgress, and TemplatesSection components ([968b87d](https://github.com/NickSalA/pactus-frontend/commit/968b87daa6cb0a27ac666ef324cda16d05479303))
* **admin:** [SCRUM-34] add size prop to AdminModalShell and set sticky aside ([66c069f](https://github.com/NickSalA/pactus-frontend/commit/66c069f18e5a66fdbdc59b4d28fa178135654a82))
* **admin:** SCRUM-29 define organization config schema with zod ([987f16a](https://github.com/NickSalA/pactus-frontend/commit/987f16a7728fc78f8330f74f8e045d64f3b0f157))
* **admin:** SCRUM-30 scaffold base layout for organization modal ([188bbb0](https://github.com/NickSalA/pactus-frontend/commit/188bbb07b72b13299c2b667caf51ed9b33bc5917))
* **admin:** SCRUM-31 implement form UI sections for organization ([7299439](https://github.com/NickSalA/pactus-frontend/commit/72994399d44973d5568859f8e276039d11cb1d9b))
* **admin:** SCRUM-32 integrate react-hook-form with zod validation ([994e885](https://github.com/NickSalA/pactus-frontend/commit/994e8858ceaafef5115fbc72bda69981a7df6c03))
* **admin:** SCRUM-33 consume GET api to populate initial form data ([9b7073b](https://github.com/NickSalA/pactus-frontend/commit/9b7073b3e6c6cc3eb8011bc13b86640dd7f0f473))
* **admin:** SCRUM-34 integrate PATCH api and sidebar trigger for organization config ([8f661c4](https://github.com/NickSalA/pactus-frontend/commit/8f661c40b0d80d452c72cf67ac4c4bd95de454a1))
* **api:** add dashboard API functions for area charts, alerts, recent contracts, and top rankings ([259bf4a](https://github.com/NickSalA/pactus-frontend/commit/259bf4a8f4c0cd15552974a0eb6906e431070c20))
* **api:** add new API types and interfaces for document, folder, integration, notification, organization, service, and template management ([71e241a](https://github.com/NickSalA/pactus-frontend/commit/71e241ad1a80069b16ac936eb1fd03d8da43bc86))
* **auth:** update routing for user roles in login and callback pages ([709af53](https://github.com/NickSalA/pactus-frontend/commit/709af53083ab903742a8af3939df68dd0c0ae389))
* **charts:** add area chart, top companies, and top services components for dashboard ([2c09c60](https://github.com/NickSalA/pactus-frontend/commit/2c09c608ae8af61d3dea3d68fc7ef4112e7d288d))
* **contracts:** extraer DocumentTypeBadge como componente reutilizable ([e3f02f9](https://github.com/NickSalA/pactus-frontend/commit/e3f02f910ebddba87511d0a41ded38136d5309c8))
* **contracts:** extraer DocumentTypeBadge como componente reutilizable ([655416d](https://github.com/NickSalA/pactus-frontend/commit/655416d9e12a68b5146fdd1968db2f4de1f613f3))
* **dashboard:** add DashboardAlertCenter component for alert management ([e2f82cb](https://github.com/NickSalA/pactus-frontend/commit/e2f82cb866753d58cc09ad471c25d5e4c9588ace))
* **dashboard:** add DashboardAlertCenter, DashboardAreaChart, DashboardTopCompanies, and DashboardTopServices components with loading states and data visualization ([6c54892](https://github.com/NickSalA/pactus-frontend/commit/6c548929cf6daf147f5dda57bf87e23d8530ef4b))
* **dashboard:** add hooks for HR and Manager dashboard data fetching ([bde9ab2](https://github.com/NickSalA/pactus-frontend/commit/bde9ab2c9b0571faa783830831b3e5c21dbd86e9))
* **dashboard:** add HR and Manager dashboard components with area charts and placeholders ([3f79378](https://github.com/NickSalA/pactus-frontend/commit/3f793784f487fc3400e7bfc653d639155af11132))
* **dashboard:** add HR and Manager dashboard page components ([c0d2086](https://github.com/NickSalA/pactus-frontend/commit/c0d20867b722225ce114c7ff2016f9f366bf741d))
* **dashboard:** add recent documents table, welcome component, and alert center ([e8900be](https://github.com/NickSalA/pactus-frontend/commit/e8900be701573323de9745900efd79dcdbccf445))
* **dashboard:** add recent documents table, welcome component, and alert center ([4e91683](https://github.com/NickSalA/pactus-frontend/commit/4e91683a10c8290060cc6da03957821a69936ebb))
* **dashboard:** enhance loading state with skeleton UI and update loading message in DashboardRecentDocumentsTable ([9237efb](https://github.com/NickSalA/pactus-frontend/commit/9237efb5e36e9c9100893615b8fdfcc082fe40c9))
* **dashboard:** implement useDashboardHRPage and useDashboardManagerPage hooks for enhanced data handling ([5037103](https://github.com/NickSalA/pactus-frontend/commit/5037103a68d0d0390be1a48c80f00a33ba917f1f))
* **dashboard:** integrate DashboardAlertCenter into HR and Manager pages ([1c1a4ec](https://github.com/NickSalA/pactus-frontend/commit/1c1a4ec76d8b43c106e6ad8edae8cd9cb93cbd33))
* **dashboard:** integrate recent contracts table into HR and Manager dashboard pages ([d5b9fe1](https://github.com/NickSalA/pactus-frontend/commit/d5b9fe1995d3edf938bba6586f8ae61dd4a72408))
* **deps:** add recharts as a dependency for data visualization ([fa54a9f](https://github.com/NickSalA/pactus-frontend/commit/fa54a9f72100610c30c7ad16b03a2ec673276c08))
* extend shadcn button with leftIcon, rightIcon, text props and normal/emphasized variants ([23f52ac](https://github.com/NickSalA/pactus-frontend/commit/23f52ac2cefb1b76986e4996a9d3e6ac7b0f0c57))
* implement contract generation hook with multi-step wizard functionality ([040858d](https://github.com/NickSalA/pactus-frontend/commit/040858db62cdbbecf416dcd285e5348fe6c7a10c))
* implement new design system components and status color mapping ([754dae9](https://github.com/NickSalA/pactus-frontend/commit/754dae983f05737f2a9d35d506014db58512207d))
* implement state filter chips and update template status color mapping ([33ee6cb](https://github.com/NickSalA/pactus-frontend/commit/33ee6cbfbcd00fe90a4790b42beabf68298a9fd6))
* implement template mutation hooks for create, update, publish, and archive operations ([d035f35](https://github.com/NickSalA/pactus-frontend/commit/d035f35c1b5a91e4077fd92731635cf9997ad3a2))
* implement useConversations hook for fetching user conversations with React Query ([b972086](https://github.com/NickSalA/pactus-frontend/commit/b9720862d9f1850a940875770e2406442a44ea65))
* integrate React Query and Devtools for improved data fetching ([31549d3](https://github.com/NickSalA/pactus-frontend/commit/31549d32b48be6af023e01a75a9ae68ffdfe3289))
* integrate updateTemplateMutation into TemplateEditModal and AdminTemplatesSection for improved template management ([1446477](https://github.com/NickSalA/pactus-frontend/commit/14464778d7c48d12c2e66a8c2de353ff75c0a36a))
* migrate to React Query by creating new query client and provider, and implementing template hooks ([dfad2a8](https://github.com/NickSalA/pactus-frontend/commit/dfad2a82b7b601bbcb48cadd913d4aea36d29440))
* refactor API calls to use axios instance and remove fetch-client ([5ebaf29](https://github.com/NickSalA/pactus-frontend/commit/5ebaf29047844197169c5dd36a3b748099ad724d))
* restyle bot messages to open AI chat style with larger typography and remove token usage display ([71f7565](https://github.com/NickSalA/pactus-frontend/commit/71f7565ade5abdb56e84b1e0785b992c82175d46))
* **types:** update document state formatting and add dashboard types ([5098b0e](https://github.com/NickSalA/pactus-frontend/commit/5098b0e94669e607808f2339ece7e9bc03f4ab17))
* update contracts and dashboard components for improved type safety and consistency ([73f857a](https://github.com/NickSalA/pactus-frontend/commit/73f857ae7f9ff8f008c9e8125fa048e2935c4977))
* update organization api contract ([e90853a](https://github.com/NickSalA/pactus-frontend/commit/e90853ae0467fc8529a63cf704512f96777dc7d9))
* update pnpm workspace configuration and enhance global styles ([3d1740a](https://github.com/NickSalA/pactus-frontend/commit/3d1740afda4daeda61d67ca8a69745ee6e44890d))
* update routing and restructure dashboard pages for role-based access ([a39d036](https://github.com/NickSalA/pactus-frontend/commit/a39d036704bb6b29c4da5e1cff65f998fa76de2b))


### BREAKING CHANGES

* merge developer into main after successful release v1.0.1

## [1.0.1](https://github.com/NickSalA/contractia-frontend/compare/v1.0.0...v1.0.1) (2026-05-23)


### Bug Fixes

* update Git author and committer email in release workflow ([5e9d9e0](https://github.com/NickSalA/contractia-frontend/commit/5e9d9e04a64a3993fab129d19b59c56daca85cab))

# 1.0.0 (2026-05-23)


### Bug Fixes

* simplify text in AdminTemplatesSection for clarity ([c9f39dc](https://github.com/NickSalA/contractia-frontend/commit/c9f39dce2907382f17168f277f271ccb05c68233))
* update text in HeroSection for clarity and accuracy ([3a96676](https://github.com/NickSalA/contractia-frontend/commit/3a96676439b0ecf8613c8c0773c9432eee69516d))
* update text in HeroSection for clarity and accuracy ([b9b8f6c](https://github.com/NickSalA/contractia-frontend/commit/b9b8f6c43fb02ee4fe08e3c97a7d5a966febc71d))
* update title in metadata for accuracy ([1c1c384](https://github.com/NickSalA/contractia-frontend/commit/1c1c384511a1c5769fc9138c1467d099725109db))


### Features

* add GitHub Actions workflow for semantic release ([24d3df8](https://github.com/NickSalA/contractia-frontend/commit/24d3df816cf465ad28c7c5eeb69bd0a9e1a31061))
* add Home page with Navbar and HeroSection components ([6ebc1c5](https://github.com/NickSalA/contractia-frontend/commit/6ebc1c5b043056a6700a21cf075a7f1e17fd3680)), closes [#1152D4](https://github.com/NickSalA/contractia-frontend/issues/1152D4)
* add Sidebar and Header components with navigation ([c90344a](https://github.com/NickSalA/contractia-frontend/commit/c90344ae7299a98d24f760c8412e7ecdabe97e81)), closes [#3b82f6](https://github.com/NickSalA/contractia-frontend/issues/3b82f6) [#1e40af](https://github.com/NickSalA/contractia-frontend/issues/1e40af)
* implement legal pages and add terms and privacy policy links to login screen ([#30](https://github.com/NickSalA/contractia-frontend/issues/30)) ([7a0ede0](https://github.com/NickSalA/contractia-frontend/commit/7a0ede07df5bd33580eb0d4eb2c3c92c36f0064e))
* initialize Next.js project with base configuration and API client ([0032ba7](https://github.com/NickSalA/contractia-frontend/commit/0032ba774932fa28501566a71ac4c5569a92bf27))
* mejoras UI/UX sidebar historial y renderizado de tablas en chat ([39f0147](https://github.com/NickSalA/contractia-frontend/commit/39f014715c83e08fd65e685e5b11714f8c6a0656))
* UI improvements and API integration ([#9](https://github.com/NickSalA/contractia-frontend/issues/9)) ([38a0daf](https://github.com/NickSalA/contractia-frontend/commit/38a0daf47f42be81d0a038d16a8acebd26d9af24)), closes [#1](https://github.com/NickSalA/contractia-frontend/issues/1) [#2](https://github.com/NickSalA/contractia-frontend/issues/2) [#4](https://github.com/NickSalA/contractia-frontend/issues/4) [#5](https://github.com/NickSalA/contractia-frontend/issues/5) [#6](https://github.com/NickSalA/contractia-frontend/issues/6) [#7](https://github.com/NickSalA/contractia-frontend/issues/7) [#8](https://github.com/NickSalA/contractia-frontend/issues/8) [#7](https://github.com/NickSalA/contractia-frontend/issues/7)
* **ui:** mejorar selección múltiple, agregar filtros de fecha y ordenamiento en tablas ([d1fa2b7](https://github.com/NickSalA/contractia-frontend/commit/d1fa2b7403e1c275262aa0a08e3c7645e91ab14c))


### Performance Improvements

* **api:** avoid redundant document fetches using caching ([#10](https://github.com/NickSalA/contractia-frontend/issues/10)) ([232317f](https://github.com/NickSalA/contractia-frontend/commit/232317f351b8da29f48360c7cd3d311bc3f87df9))
