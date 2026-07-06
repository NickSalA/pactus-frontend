# [2.5.0](https://github.com/NickSalA/pactus-frontend/compare/v2.4.0...v2.5.0) (2026-07-06)


### Bug Fixes

* **auth:** update setSubscriptionActive to accept null value ([7247d4f](https://github.com/NickSalA/pactus-frontend/commit/7247d4f733adb05728d8dfed951e17fb42cf895b))
* **auth:** update subscription state on 403 error response ([80a5e0b](https://github.com/NickSalA/pactus-frontend/commit/80a5e0b2095b709d822ceebc8b2663a641e350c2))


### Features

* **audit:** add AI token usage tracking and reporting functionality ([1536380](https://github.com/NickSalA/pactus-frontend/commit/1536380d4fd325d507c0beb53c3505a427492b12))

# [2.4.0](https://github.com/NickSalA/pactus-frontend/compare/v2.3.0...v2.4.0) (2026-06-23)


### Bug Fixes

* **axios:** guard SSR window access and reject on 402 instead of hanging promise ([a889862](https://github.com/NickSalA/pactus-frontend/commit/a889862e3aaecd9193fc8aff6c466fff7bcc9599))
* **login:** ensure logout is called even if supabase signOut fails ([b69e93a](https://github.com/NickSalA/pactus-frontend/commit/b69e93ae974dbf3c614be2f71c10e42c3f2039d6))
* **package:** correct formatting of @paypal/react-paypal-js dependency ([e287970](https://github.com/NickSalA/pactus-frontend/commit/e287970b184b549a8778575764c48b908c743102))
* **pricing:** adjust CardFooter styling for better layout consistency ([bdd2720](https://github.com/NickSalA/pactus-frontend/commit/bdd272067d24e9587e877db11122e55c5dd3baa6))


### Features

* **api:** redirect to pricing on 402 Payment Required response ([8ff0596](https://github.com/NickSalA/pactus-frontend/commit/8ff0596b42c2905c5bd0c5f4ce3fcd89df602ee7))
* **auth:** add subscriptionActive to AuthDisplayUser and update mappers ([2828271](https://github.com/NickSalA/pactus-frontend/commit/282827158c82a38da68259d2c515e95c3f461dd9))
* **auth:** connect subscription_active from backend response ([81ff1a4](https://github.com/NickSalA/pactus-frontend/commit/81ff1a40c18a317c0c13492011894cb4e17e293e))
* **billing:** add subscription status response type ([9be3867](https://github.com/NickSalA/pactus-frontend/commit/9be38670d3d42aa743acc01c4ceda1ee7714b991))
* **billing:** export subscription status response type ([a5aafa3](https://github.com/NickSalA/pactus-frontend/commit/a5aafa35a125bd7ade26feb22b3dc4612b8f11b8))
* **dependencies:** add @paypal/react-paypal-js for PayPal integration ([e13c5ad](https://github.com/NickSalA/pactus-frontend/commit/e13c5ad8c5827ec51445500fba5a7e2fce49adb2))
* **layout:** wrap main layout with PaywallGuard ([f65c7f1](https://github.com/NickSalA/pactus-frontend/commit/f65c7f1ac6b5498db67c46b2e2688529f533db54))
* **login:** add switch account option on active session ([5b3cfaa](https://github.com/NickSalA/pactus-frontend/commit/5b3cfaa7e44ea6d69c63a28fee0c75d7cc2cc609))
* **payments:** implement PayPal subscription confirmation flow and add success modal ([da1596e](https://github.com/NickSalA/pactus-frontend/commit/da1596eec87a383752bec09ca4e718c5d3499495))
* **payments:** integrate PayPal subscription flow and update content imports ([55fba0e](https://github.com/NickSalA/pactus-frontend/commit/55fba0e5e7ee84bcdb46ac5c8ae4584c76618fc9))
* **paywall:** add PaywallGuard component to redirect inactive subscriptions ([fdfc811](https://github.com/NickSalA/pactus-frontend/commit/fdfc811ed8477a0f0d64975e1cee553bc8561343))
* **pricing:** adjust layout and improve responsiveness for PayPal integration ([f201ac2](https://github.com/NickSalA/pactus-frontend/commit/f201ac2e46e38cf5f91c0951554d3006670be148))
* **pricing:** enhance PricingCard with email input and integrate PayPal subscription flow ([5226dcb](https://github.com/NickSalA/pactus-frontend/commit/5226dcb58aec097f6250eb9dfd41c07636ab441d))
* **pricing:** enhance PricingCard with error handling and loading state for PayPal subscription ([ccf8c45](https://github.com/NickSalA/pactus-frontend/commit/ccf8c45d4532f2bb1b4cef13f0c1a93f90ef39bd))
* **pricing:** update text color for PricingCard and PricingGrid headings to enhance visual consistency ([c8053cc](https://github.com/NickSalA/pactus-frontend/commit/c8053ccf57ada8d2578f74b30f352f41e4fcbc9b))
* **store:** add subscriptionActive state to authStore ([fd5de2c](https://github.com/NickSalA/pactus-frontend/commit/fd5de2cfa470db0cf502cd94e31e95908dd59f62))
* **types:** add optional subscription_active field to User type ([9379dc1](https://github.com/NickSalA/pactus-frontend/commit/9379dc15c0740176eb387d044bd251a438e8eace))
* **types:** make subscription_active required in User type ([49f89bd](https://github.com/NickSalA/pactus-frontend/commit/49f89bd9c261cef2bbf2839cb1b7a0aaf187ef16))
* **users:** add optional subscription_active field to ApiUserResponse ([ffcd5bb](https://github.com/NickSalA/pactus-frontend/commit/ffcd5bbf7f8ebb5ffea0986143bfd53e956daab7))
* **users:** make subscription_active required in ApiUserResponse ([3d7d842](https://github.com/NickSalA/pactus-frontend/commit/3d7d842cc9dcb34c8cae3456ac3ff85e499faf05))

# [2.3.0](https://github.com/NickSalA/pactus-frontend/compare/v2.2.0...v2.3.0) (2026-06-16)


### Bug Fixes

* **privacy-policy, terms-of-service:** remove unnecessary legal document label and improve text formatting ([91f033a](https://github.com/NickSalA/pactus-frontend/commit/91f033a0a19f30560ff3449cfbe6c69874c9ec96))


### Features

* **audit:** add AdminAuditContractsTable component ([b51b100](https://github.com/NickSalA/pactus-frontend/commit/b51b1008ea4a66bab59932f69298d9021ff08f72))
* **audit:** add AdminAuditTemplatesTable component ([6a22b62](https://github.com/NickSalA/pactus-frontend/commit/6a22b62ad04c5eb38ff7e1ab3810c42539f34dc5))
* **audit:** add ApiAuditContractActivityAction type ([a95c84c](https://github.com/NickSalA/pactus-frontend/commit/a95c84c056f43de603dae4f80807455bf4e239fc))
* **audit:** add ApiAuditContractActivityListResponse type ([196815e](https://github.com/NickSalA/pactus-frontend/commit/196815e6cc23797ffadfac1fc4801c5d1b3d9374))
* **audit:** add ApiAuditContractActivityResponse interface ([27f90a8](https://github.com/NickSalA/pactus-frontend/commit/27f90a861f867cfb53d9cf3a1a0c39bf70029adc))
* **audit:** add ApiAuditTemplateActivityAction type ([325f784](https://github.com/NickSalA/pactus-frontend/commit/325f784faca6512031bf2f4f259fb792d52588e7))
* **audit:** add ApiAuditTemplateActivityListResponse type ([bc4585b](https://github.com/NickSalA/pactus-frontend/commit/bc4585b39be11b8e6d6f06ab01eed5b0003c5488))
* **audit:** add ApiAuditTemplateActivityResponse interface ([63ae2db](https://github.com/NickSalA/pactus-frontend/commit/63ae2db3952aae1dafb2ff63c71a611077569a8e))
* **audit:** add Contratos and Plantillas tabs to audit page ([a8fa2c2](https://github.com/NickSalA/pactus-frontend/commit/a8fa2c279e02adeeefbd4ae615c6b8b918212726))
* **audit:** add labels and colors for template and contract actions ([65e5fc8](https://github.com/NickSalA/pactus-frontend/commit/65e5fc83a33fc43e89c9a5f37bd28e0fe1902dae))
* **audit:** add listTemplateActivity and listContractActivity API functions ([fc84ae9](https://github.com/NickSalA/pactus-frontend/commit/fc84ae982799cc94190f44278e1b8f788d659e73))
* **audit:** add useTemplateActivity and useContractActivity query hooks ([481dbd0](https://github.com/NickSalA/pactus-frontend/commit/481dbd03c24d0b676368e3d6e06f925ac76145a3))
* **audit:** export new audit API functions ([6c1a583](https://github.com/NickSalA/pactus-frontend/commit/6c1a583a9578ea15a29fcf17c230b17d4f9fc8ef))
* **audit:** export new contract and template activity types ([212e80d](https://github.com/NickSalA/pactus-frontend/commit/212e80d4b33a4200d8a284f32933c751dc241208))
* **audit:** extend useAdminAuditPage with templates and contracts tabs ([3635782](https://github.com/NickSalA/pactus-frontend/commit/363578264ee319f0042247e3c0d75edc7c5e0ef8))
* **audit:** extract shared AdminAuditFormattedDate component ([a574681](https://github.com/NickSalA/pactus-frontend/commit/a574681d9272579e8f7e161676688a116ee11ffd))
* **home:** add additional sections to HomePage for enhanced content presentation ([59b268b](https://github.com/NickSalA/pactus-frontend/commit/59b268bfb09aa6cb3a51cf77a49ba1b474acddb6))
* **home:** add smooth scrolling behavior and update section classes for better UX ([ea81cf3](https://github.com/NickSalA/pactus-frontend/commit/ea81cf3e0446db9ba23490f012e559434c26b884))
* **home:** implement landing page structure with new sections and components ([801886f](https://github.com/NickSalA/pactus-frontend/commit/801886ff285040a1a8fa72e3fea0a40b9b117f41))
* **home:** implement public landing page with multiple sections and responsive design ([7228fb8](https://github.com/NickSalA/pactus-frontend/commit/7228fb8a4b71332cbee16075065529ff772f30bb))
* **home:** remove unused sections from HomePage component for cleaner layout ([7c4ab05](https://github.com/NickSalA/pactus-frontend/commit/7c4ab059565f95c614845ac36578104f5384f835))
* **legal:** add LegalScrollTop component for automatic scroll to top on route change ([79f4b4e](https://github.com/NickSalA/pactus-frontend/commit/79f4b4e6338b9b291e27d6c41c14376da0320c5f))
* **legal:** remove redundant legal document label and improve text formatting in Privacy Policy and Terms of Service pages ([88b802a](https://github.com/NickSalA/pactus-frontend/commit/88b802a536bcfa3359ecd3238a097530bff96a55))
* **legal:** update layout and content for Legal, Privacy Policy, and Terms of Service pages ([f0c5366](https://github.com/NickSalA/pactus-frontend/commit/f0c5366d908f18cca31ca2b42ceb73db984dac2c))
* migrate google drive import to drive file ([730155c](https://github.com/NickSalA/pactus-frontend/commit/730155c29b125f92f3665f9c1f8547dcab23c462))
* **navbar:** implement smooth scrolling for navigation links ([e567e71](https://github.com/NickSalA/pactus-frontend/commit/e567e71bb3eb8f3851e3d372f55322d96195a07e))
* update member role schema for zod validation ([fc623ed](https://github.com/NickSalA/pactus-frontend/commit/fc623ed254ef8f9b443b032c73f0a02ed28d3038))

# [2.2.0](https://github.com/NickSalA/pactus-frontend/compare/v2.1.0...v2.2.0) (2026-06-09)


### Bug Fixes

* **admin:** fix AdminMembersTable height to be content-adaptive with scroll ([86969d0](https://github.com/NickSalA/pactus-frontend/commit/86969d02bc0f70468487b04968dd024383f29e05))
* **admin:** restore pagination footer visibility and preserve horizontal scroll in services table ([1772bdb](https://github.com/NickSalA/pactus-frontend/commit/1772bdb8d790cc6ef9a7ab38da5d67753a967e17))
* **admin:** restore pagination footer visibility in services table ([865e1f8](https://github.com/NickSalA/pactus-frontend/commit/865e1f8dec2e4ac19574bd0b4748e4344d2babd0))
* **admin:** wrap AdminMembersTable with flex-1 min-h-0 for correct layout ([dacba06](https://github.com/NickSalA/pactus-frontend/commit/dacba0638036fbff37ea3e516276d3fe086eed06))
* **ui:** set solid background on TablePagination footer ([30464ec](https://github.com/NickSalA/pactus-frontend/commit/30464ec00ab8d1b53b58ad1746e4d5c72c66f12a))


### Features

* **admin:** add DeleteMemberModal with AdminModalShell ([4591af8](https://github.com/NickSalA/pactus-frontend/commit/4591af8ec7e4e239e1d25012915832bfd6f4263b))
* **admin:** add EditMemberModal with RHF and Zod validation ([6c7323c](https://github.com/NickSalA/pactus-frontend/commit/6c7323ccac5dc0d6a9d8133b847a739b5dc96e9f))
* **admin:** add Zod schemas for member management forms ([c345ab8](https://github.com/NickSalA/pactus-frontend/commit/c345ab8c17abb267f40acc068aed7c82b51e36f8))
* **admin:** remove Gestor de Carpetas tab from document management ([49eefd2](https://github.com/NickSalA/pactus-frontend/commit/49eefd265bc0f9eab5e96c48ab7383360f441ce5))
* **admin:** rewrite AddMemberModal with RHF and Zod validation ([aa4a457](https://github.com/NickSalA/pactus-frontend/commit/aa4a4575ade90c8245d684b72a7d7fe4de8db0f8))
* **api:** add members API layer with CRUD endpoints ([61b90c0](https://github.com/NickSalA/pactus-frontend/commit/61b90c09c949a6357317204d44f13f99ffe5ab56))
* **api:** add users API layer with getMe, updateUser, deleteUser ([1383d73](https://github.com/NickSalA/pactus-frontend/commit/1383d734e0575181c3680d83f8f0ee8272c3dbbd))
* **audit:** add Admin Audit Chatbot table and integrate with user activity logs ([e2fc2ee](https://github.com/NickSalA/pactus-frontend/commit/e2fc2ee92ae3dac61e0807a3745fee35a4256ab2))
* **audit:** add Admin Audit page and integrate with sidebar menu ([4f8f594](https://github.com/NickSalA/pactus-frontend/commit/4f8f59472a4f5dc55c09e57d2f0b29c666a89693))
* **audit:** add types for chatbot and user activity audit logs ([7ff660a](https://github.com/NickSalA/pactus-frontend/commit/7ff660a9e759e15057378e1facaff0bac89577eb))
* **audit:** add user and chatbot activity query functions and types ([cc34c93](https://github.com/NickSalA/pactus-frontend/commit/cc34c93c6d2f85858ba026d9ddca9dd6bb5233a8))
* **audit:** enhance Admin Audit page with user activity table and utility functions ([4c700c9](https://github.com/NickSalA/pactus-frontend/commit/4c700c9234a003cc06e2bce9c5046b8efe4ecb82))
* **audit:** implement admin audit page hook for user and chatbot activity ([077dbc3](https://github.com/NickSalA/pactus-frontend/commit/077dbc3ffa84101b6f0209144663a08c77ee7ebc))
* **queries:** add admin query and mutation hooks for member management ([7769361](https://github.com/NickSalA/pactus-frontend/commit/776936116bb1168ad10abdee5e357dbb4d305458))
* **types:** add ApiUserUpdateRequest type ([7966b7a](https://github.com/NickSalA/pactus-frontend/commit/7966b7a899607d7fef5a9bc2c37a2737911707a1))
* **types:** export ApiUserUpdateRequest from apiUser barrel ([fd74927](https://github.com/NickSalA/pactus-frontend/commit/fd7492721b690272119e577fb07428f2f085342f))

# [2.1.0](https://github.com/NickSalA/pactus-frontend/compare/v2.0.2...v2.1.0) (2026-06-02)


### Bug Fixes

* add skipServicesStep flag to bypass step 2 in wizard navigation ([7a01361](https://github.com/NickSalA/pactus-frontend/commit/7a01361d2de8ba56b83deb3ab28e41c31d128cfd))
* hide services section and show 2-step progress for LABOR contracts ([3b20717](https://github.com/NickSalA/pactus-frontend/commit/3b20717a5ee0243527c7e73cb6cc8715e6de3e52))
* Incorrect text copied to the MarkdownRenderer eliminated ([92a70ba](https://github.com/NickSalA/pactus-frontend/commit/92a70ba06c02b364ea57d738d82d440d3a15e1da))
* skip services step and validation for LABOR contract type ([b6e55ea](https://github.com/NickSalA/pactus-frontend/commit/b6e55ea4dffc84197f343347cfc46b846a45c406))


### Features

* add CONTRACT_STEPS constant to eliminate magic step numbers ([8e316be](https://github.com/NickSalA/pactus-frontend/commit/8e316be905fdc0cb35924a8af8c8b62ffdb10d6b))
* add Drive import review flow ([0e6aa8d](https://github.com/NickSalA/pactus-frontend/commit/0e6aa8d97a9e9e5fc872c90342d0676f9505f259))
* add Drive import SSE API contract ([fb8289c](https://github.com/NickSalA/pactus-frontend/commit/fb8289cd7026def2a44afb28f7497f387087af5f))
* add hasServicesStep helper to centralize contract type check ([5323d2b](https://github.com/NickSalA/pactus-frontend/commit/5323d2b49c276c853923ec5e6d742da54427735c))
* add import session store ([a658d2b](https://github.com/NickSalA/pactus-frontend/commit/a658d2b547f978c992a6ad1705efba33fed53753))
* **ai-agent:** add chart rendering and labels display for pie charts ([09d85d8](https://github.com/NickSalA/pactus-frontend/commit/09d85d8112a9b79668a37d1d3270d1aa632af6f7))
* **ai-agent:** add chart rendering support for chatbot responses ([f8b8663](https://github.com/NickSalA/pactus-frontend/commit/f8b8663c596c8536caa3d8510ed05d15e0f9380c))
* **ai-agent:** add chart rendering support for chatbot responses ([723285b](https://github.com/NickSalA/pactus-frontend/commit/723285b898f6c9442173bce5b447b77b855aca77))
* **ai-agent:** add conversation update and delete functionality ([a9af326](https://github.com/NickSalA/pactus-frontend/commit/a9af326eed84bcebe92ae39465e9ccb42a1c8420))
* **ai-agent:** add delete confirmation modal with AlertDialog ([d902fc8](https://github.com/NickSalA/pactus-frontend/commit/d902fc826728e102be7c30bbad8ee6366f5fc587))
* **ai-agent:** add optimistic updates for conversation rename and delete ([5c3b776](https://github.com/NickSalA/pactus-frontend/commit/5c3b7763d248603d2f59bba5194fd449da90563e))
* **ai-agent:** add optional chart field to ChatMessage type ([e91d5fc](https://github.com/NickSalA/pactus-frontend/commit/e91d5fc3b1cc9852c76e0c1b02c5c6b1236e321c))
* **ai-agent:** improve ChatHistorySidebar styling and make entire row clickable ([a973e90](https://github.com/NickSalA/pactus-frontend/commit/a973e90924d3e3abedac4b5d07abc66afaab19e1))
* **api:** align API types with OpenAPI specification ([94bff14](https://github.com/NickSalA/pactus-frontend/commit/94bff141fdbbe3256acb121d3e3d85d1362d2c95))
* Conditionally render services section based on form type ([3fe6da0](https://github.com/NickSalA/pactus-frontend/commit/3fe6da086a03adec15c8d7a0138f5968c9fe895b))
* show background import progress ([6b1b7b2](https://github.com/NickSalA/pactus-frontend/commit/6b1b7b23dc0c12451ab52d4db192777c13e3b940))
* show Drive import phase progress ([661a1ef](https://github.com/NickSalA/pactus-frontend/commit/661a1efeba47e863702ced1d6687e28947332f69))
* track Drive import jobs in global store ([a47fd2f](https://github.com/NickSalA/pactus-frontend/commit/a47fd2f02b62838536d2195c46927d746fce0c89))
* wire Drive import flow to SSE jobs ([9f39f03](https://github.com/NickSalA/pactus-frontend/commit/9f39f0375fca195c8e1e4fd878825870ee52846e))
* wire Google Drive import API ([ebe4fb6](https://github.com/NickSalA/pactus-frontend/commit/ebe4fb6d80702aa7f6aec46de9d574bae13f9289))

## [2.0.2](https://github.com/NickSalA/pactus-frontend/compare/v2.0.1...v2.0.2) (2026-05-26)


### Bug Fixes

* Fixed incorrect redirection /dashboard ([3fe9b7c](https://github.com/NickSalA/pactus-frontend/commit/3fe9b7c7947bbac31d93b1931c0c2c7c5dd0e742))

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
