# AMS Project TODO

## Phase 1: Database Schema & API Structure
- [x] Design and implement complete database schema (users, roles, departments, courses, sessions, assignments, grades, attendance, notifications)
- [x] Create Drizzle ORM schema file with all tables and relationships
- [x] Generate and apply database migrations
- [x] Set up database query helpers in server/db.ts

## Phase 2: Authentication & RBAC
- [x] Extend user table with student/lecturer/hod/admin specific fields
- [x] Implement role-based access control (RBAC) middleware
- [x] Create protected procedures for each role
- [x] Build authentication UI (login, signup, role selection)
- [x] Test authentication flow and role-based access

## Phase 3: Core Data Models & API Routes
- [x] Create department management API (create, read, update, delete)
- [x] Create course definition and offering API
- [x] Create course enrollment API (students registering/dropping courses)
- [x] Create lecturer assignment to courses API
- [x] Create session management API (schedule, reschedule, cancel)
- [x] Create assignment CRUD API
- [x] Create submission and grading API
- [x] Create attendance tracking API
- [x] Write vitest tests for core APIs

## Phase 4: Student Dashboard
- [x] Build student dashboard layout and navigation
- [x] Implement enrolled courses view with course details
- [x] Implement grades view (course grades and assignment grades)
- [x] Implement attendance tracking view (per-course attendance percentage)
- [x] Implement assignments view (view, submit, track status)
- [x] Implement assignment submission UI with file upload
- [x] Implement feedback/comments view on graded assignments
- [x] Write vitest tests for student features

## Phase 5: Lecturer Dashboard
- [x] Build lecturer dashboard layout and navigation
- [x] Implement assigned courses view
- [x] Implement course management (view course details, students)
- [x] Implement session management UI (create, reschedule, cancel sessions)
- [x] Implement attendance marking interface (mark present/absent per session)
- [x] Implement assignment creation UI
- [x] Implement assignment review and grading UI
- [x] Implement marking guide/rubric upload for AI grading
- [x] Implement course analytics view (grade distribution, attendance trends)
- [x] Implement gradebook view (hidden from students)
- [x] Implement export functionality (attendance, gradebook to CSV/PDF)
- [x] Write vitest tests for lecturer features

## Phase 6: HOD & Admin Dashboards
- [x] Build HOD dashboard layout and navigation
- [x] Implement department overview (students, lecturers, courses)
- [x] Implement student profile view and level offset update
- [x] Implement course definition management (create, read, update, delete)
- [x] Implement course offering management (activate/deactivate)
- [x] Implement lecturer assignment to courses
- [x] Implement HOD analytics (department performance, lecturer performance)
- [x] Build Admin dashboard layout and navigation
- [x] Implement faculty management (create, read, update, delete)
- [x] Implement department management (create, read, update, delete)
- [x] Implement academic session management (create, read, update, delete)
- [x] Implement semester management (create, update, delete, activate)
- [x] Implement user management (create, edit, assign roles)
- [x] Implement system-wide analytics and settings
- [x] Write vitest tests for HOD/Admin features

## Phase 7: AI Tutoring & Automatic Grading
- [x] Implement AI tutor chatbox component
- [x] Create AI tutor page with course selection
- [x] Create AI tutor API endpoint (chat with context from course materials)
- [x] Implement course material upload and storage
- [x] Implement AI grading API (grade submissions using marking guide)
- [x] Implement AI grading UI in lecturer dashboard
- [x] Implement grade review and approval workflow (human-in-the-loop)
- [x] Implement AI tutor instruction/rule management for lecturers
- [x] Write vitest tests for AI features

## Phase 8: Analytics, Reporting & Notifications
- [x] Implement student performance analytics (per-course and overall)
- [x] Implement grade distribution charts
- [x] Implement attendance trend charts
- [x] Implement course performance analytics
- [x] Implement departmental analytics
- [x] Create notification system database schema
- [x] Implement notification API (create, read, mark as read)
- [x] Implement role-aware notification triggers (assignments, grades, attendance, announcements)
- [x] Implement notifications UI (notification center, toast alerts)
- [x] Implement course announcements feature
- [x] Write vitest tests for analytics and notifications

## Phase 9: Polish, Testing & Delivery
- [x] Review and refine all UI for elegance and consistency
- [x] Implement responsive design for all dashboards
- [x] Test all role-based access controls
- [x] Test all workflows end-to-end
- [x] Optimize performance and loading states
- [x] Add error handling and user feedback
- [x] Create checkpoint and prepare for deployment
- [x] Final review and delivery
