# Product Roadmap / Epic Breakdown

## Planning Principles
- Domain model and backend APIs are delivered before UI work for each module.
- Every module includes acceptance criteria and a definition of done (DoD).
- Dependencies are explicitly listed to help sprint sequencing.

## Dependency Sequence (Backend First)
1. **Authentication + Role-Based Authorization (backend/domain)**
2. **Academic Master Data (backend/domain + admin UI)**
3. **Grading Engine (Kurikulum Merdeka) (backend/domain + teacher UI)**
4. **Report Generation (backend/domain + wali kelas UI + export)**
5. **PWA Capabilities (cross-cutting frontend + build/deploy)**

---

## Epic 1 — Authentication + Role-Based Authorization

### Scope
Implement identity, login lifecycle, and permission enforcement for:
- `ADMIN`
- `GURU_MAPEL`
- `WALI_KELAS`

### Suggested Issues
- [ ] **AUTH-1:** User entity, role enum, and seed users
- [ ] **AUTH-2:** Login/logout endpoint + session/JWT strategy
- [ ] **AUTH-3:** Authorization middleware/guard by role and action
- [ ] **AUTH-4:** Audit log for restricted actions
- [ ] **AUTH-5:** UI route guards and unauthorized page state

### Acceptance Criteria
- Only authenticated users can access protected endpoints.
- Roles are limited to `ADMIN`, `GURU_MAPEL`, `WALI_KELAS`.
- Permission checks are enforced per action (create/read/update/delete/export/approve where relevant).
- Unauthorized access attempts return proper HTTP status (401/403).
- UI blocks or hides actions the role cannot perform.

### Definition of Done
- Role matrix documented and implemented in backend authorization checks.
- Integration tests cover successful and denied access for each role/action pair.
- Security review completed for token/session handling and password policy.
- Basic audit trail records actor, action, entity, timestamp.

### Dependencies
- None (foundation epic).

---

## Epic 2 — Academic Master Data

### Scope
Master data management for:
- Students
- Classes
- Subjects
- Teacher–Subject mapping

### Suggested Issues
- [ ] **MD-1:** Domain models + relational mapping (student/class/subject/teacher-subject)
- [ ] **MD-2:** CRUD APIs for students with validation
- [ ] **MD-3:** CRUD APIs for classes with validation
- [ ] **MD-4:** CRUD APIs for subjects with validation
- [ ] **MD-5:** CRUD APIs for teacher-subject assignment with validation
- [ ] **MD-6:** Admin UI forms and list pages for all master entities

### Validation Rules (minimum)
- Student identifiers are unique and required.
- Class codes/names are unique per academic year.
- Subject codes are unique and required.
- Teacher-subject mapping cannot duplicate the same teacher + subject + class context.
- Referential integrity enforced (cannot reference non-existent students/classes/subjects/teachers).

### Acceptance Criteria
- Full CRUD works for all listed entities.
- Server-side validation rejects invalid/duplicate records with clear error messages.
- Only authorized roles can manage each entity (typically `ADMIN`; read scopes may vary).
- Data can be filtered/searched for practical operations.

### Definition of Done
- Migration/schema updates merged and versioned.
- API contract documented (request/response + validation errors).
- Automated tests cover CRUD happy path and validation failures.
- Admin UI can create/edit/delete records and displays backend validation errors.

### Dependencies
- Depends on **Epic 1** for identity and permission controls.

---

## Epic 3 — Grading Engine (Kurikulum Merdeka)

### Scope
Build score calculation and persistence for knowledge and skill components:
- Knowledge: `PH`, `PTS`, `PAS`
- Skill: `praktik`, `proyek`, `produk`
- Final score formula: `(knowledge + skill) / 2`
- Predicate mapping: `A / B / C / D`

### Suggested Issues
- [ ] **GRD-1:** Grade domain model for knowledge and skill components
- [ ] **GRD-2:** Calculation service for knowledge aggregate
- [ ] **GRD-3:** Calculation service for skill aggregate
- [ ] **GRD-4:** Final score calculator `(knowledge + skill) / 2`
- [ ] **GRD-5:** Predicate mapper `A/B/C/D` based on threshold config
- [ ] **GRD-6:** Input/edit UI for `GURU_MAPEL`

### Acceptance Criteria
- System stores and validates PH/PTS/PAS and praktik/proyek/produk entries.
- Knowledge subtotal and skill subtotal are calculated consistently using defined rules.
- Final score strictly uses `(knowledge + skill) / 2`.
- Predicate is generated automatically as `A/B/C/D` using configurable thresholds.
- Score edit permission is restricted to authorized role(s) and scope.

### Definition of Done
- Deterministic unit tests for all formulas and predicate boundaries.
- Threshold config is environment/config driven (not hardcoded in UI only).
- APIs expose component values, final score, and predicate in one response.
- Teacher UI supports create/update and displays computed outputs read-only where appropriate.

### Dependencies
- Depends on **Epic 1** (auth/authorization).
- Depends on **Epic 2** (students/classes/subjects/teacher-subject mapping).

---

## Epic 4 — Report Generation

### Scope
Generate per-student report views and printable outputs:
- Wali kelas can view all subject grades
- Editable report descriptions
- Export/print PDF

### Suggested Issues
- [ ] **RPT-1:** Aggregation API for wali kelas (all subject grades per student)
- [ ] **RPT-2:** Editable narrative/description fields with audit metadata
- [ ] **RPT-3:** Report template rendering (HTML/PDF)
- [ ] **RPT-4:** Export/print endpoint and UI action
- [ ] **RPT-5:** Wali kelas dashboard/report page

### Acceptance Criteria
- `WALI_KELAS` can open a student report and see all subject grades in one view.
- Report descriptions can be edited and saved with role checks.
- PDF export/print produces consistent layout and values matching on-screen data.
- Unauthorized users cannot modify wali kelas narrative fields.

### Definition of Done
- End-to-end test verifies aggregation -> display -> export pipeline.
- PDF output includes key identity data, all subject scores, predicate, and descriptions.
- Version/timestamp metadata exists for generated report artifacts.
- Manual QA sign-off for at least one full class report set.

### Dependencies
- Depends on **Epic 1** (auth/authorization).
- Depends on **Epic 2** (master data relationships).
- Depends on **Epic 3** (computed grades and predicates).

---

## Epic 5 — PWA Capabilities

### Scope
Enable progressive web app behavior:
- Web app manifest
- Service worker
- Offline shell
- Installability support

### Suggested Issues
- [ ] **PWA-1:** Add and validate `manifest.webmanifest`
- [ ] **PWA-2:** Service worker setup with cache strategy (app shell first)
- [ ] **PWA-3:** Offline fallback shell/page
- [ ] **PWA-4:** Install prompt handling and icon completeness
- [ ] **PWA-5:** Lighthouse PWA quality checks in CI (or release checklist)

### Acceptance Criteria
- App provides valid manifest with name/icons/start URL/display mode.
- Service worker caches core shell for offline access.
- Offline user can open shell and view previously cached routes/assets.
- Installability checks pass on supported browsers/devices.

### Definition of Done
- Browser verification confirms service worker registration and cache population.
- Offline scenario tested (network disabled) and shell still loads.
- PWA install flow documented for QA/product.
- Lighthouse PWA score target is agreed and met (or justified exceptions tracked).

### Dependencies
- Can start after base frontend routes exist, but should be sequenced **after Epics 1–4 backend contracts are stable** to reduce cache invalidation churn.

---

## Milestone Ordering (Suggested)
- **M1:** Epic 1 complete
- **M2:** Epic 2 complete
- **M3:** Epic 3 complete
- **M4:** Epic 4 complete
- **M5:** Epic 5 complete

## Notes for Tracker Conversion
If moved to Jira/GitHub Projects:
- Use each epic title above as parent issue.
- Convert each “Suggested Issue” item into a child issue.
- Copy acceptance criteria + DoD into epic description.
- Preserve dependency links in issue relationships (`blocks` / `depends on`).
