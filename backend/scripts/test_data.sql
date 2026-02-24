-- PostgreSQL seed script with valid UUIDs


-- 17. TaskStudent (depends on Task and StudentProfile)
DELETE FROM task_student;

-- 16. Task (depends on CourseOffering and LecturerProfile)
DELETE FROM task;

-- 15. Message (depends on CourseOffering and LecturerProfile)
DELETE FROM message;

-- 14. Attendance (depends on ClassSession and StudentProfile)
DELETE FROM attendance;

-- 13. ClassSession (depends on CourseOffering and LecturerProfile)
DELETE FROM class_session;

-- 12. CourseStudent (depends on StudentProfile and CourseOffering)
DELETE FROM course_student;

-- 11. CourseLecturer (depends on LecturerProfile and CourseOffering)
DELETE FROM course_lecturer;

-- 10. CourseOffering (depends on Course, Semester, and Session)
DELETE FROM course_offering;

-- 9. StudentProfile (depends on User and Session)
DELETE FROM student_profile;

-- 8. LecturerProfile (depends on User)
DELETE FROM lecturer_profile;

-- 7. User (depends on Department)
DELETE FROM "user";

-- 6. Course (depends on Department)
DELETE FROM course;

-- 5. Semester (depends on Session)
DELETE FROM semester;

-- 4. Session (depends on School)
DELETE FROM session;

-- 3. Department (depends on Faculty)
DELETE FROM department;

-- 2. Faculty (depends on School)
DELETE FROM faculty;

-- 1. School (no dependencies)
DELETE FROM school;
-- Run this in order

-- 1. School (5)
INSERT INTO school (id, name) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', 'University of Example'),
('8a2414bd-436a-4dff-9ad9-e75e07a44f0f', 'National Institute of Technology'),
('05da80cc-0ae2-4fa0-91fa-9a59a6c0f946', 'State Polytechnic'),
('08840e4a-1400-4c3b-bee2-140223424a7d', 'College of Education'),
('0c698595-05b5-4af7-af3c-60c2fc12e007', 'Federal University of Science');

-- 2. Faculty (5)
INSERT INTO faculty (id, name, school_id) VALUES
('b0c00ab8-dcec-4da4-bddf-50cd8d3ed6ca', 'Faculty of Engineering', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f'),
('a27c3eda-7640-487a-9b0d-efd266c297a3', 'Faculty of Science', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f'),
('80aa3941-0dee-4aa6-b6e2-10bec742bf09', 'Faculty of Arts', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f'),
('8cae9d90-8d5f-44ad-b10e-1ed5d1a5355b', 'Faculty of Computing', '8a2414bd-436a-4dff-9ad9-e75e07a44f0f'),
('2dfd4e54-365a-4292-babc-9b77281766a8', 'Faculty of Management', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f');

-- 3. Department (6)
INSERT INTO department (id, name, faculty_id) VALUES
('6a218821-ce95-482a-9652-e85baf973833', 'Computer Science', 'a27c3eda-7640-487a-9b0d-efd266c297a3'),
('e4d512c0-c2ab-4fde-bf88-28640a56438e', 'Electrical Engineering', 'b0c00ab8-dcec-4da4-bddf-50cd8d3ed6ca'),
('969a2267-8f74-4dbd-9370-a48f5ae02406', 'Mechanical Engineering', 'b0c00ab8-dcec-4da4-bddf-50cd8d3ed6ca'),
('3b64a4f7-634b-4a7e-9d92-2ce51e466ce5', 'Information Technology', '8cae9d90-8d5f-44ad-b10e-1ed5d1a5355b'),
('8e796ac3-bd7c-4a03-8f6d-4b4603f5096d', 'Physics', 'a27c3eda-7640-487a-9b0d-efd266c297a3'),
('75004e15-b261-4d03-90d9-3406f9f62b40', 'Mathematics', 'a27c3eda-7640-487a-9b0d-efd266c297a3');

-- 4. Session (5)
INSERT INTO session (id, name, school_id, start_date, end_date, is_active) VALUES
('24ab8294-a0de-40e2-95ca-f3061c66fe85', '2023/2024', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', '2023-09-01', '2024-08-31', false),
('5308da1e-a0b1-4daf-b057-bcf7a7dacb39', '2024/2025', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', '2024-09-01', '2025-08-31', true),
('a6586a8a-dfe7-4749-a3db-e876afb27dee', '2022/2023', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', '2022-09-01', '2023-08-31', false),
('42a671d3-dcb9-4bd1-89c7-39345573480b', '2025/2026', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', '2025-09-01', NULL, true),
('fdce5e2c-2a6f-4bfd-bb44-d716bcdd4b3f', '2021/2022', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a52f', '2021-09-01', '2022-08-31', false);

-- 5. Semester (10)
INSERT INTO semester (id, session_id, name, start_date, end_date, is_active) VALUES
('27d7f0c8-e81b-4e7e-8191-a645ff808f97', '24ab8294-a0de-40e2-95ca-f3061c66fe85', 'FIRST', '2023-09-01', '2024-02-28', false),
('dfc19566-9f96-4016-bdba-3862b8367fdd', '24ab8294-a0de-40e2-95ca-f3061c66fe85', 'SECOND', '2024-03-01', '2024-08-31', false),
('875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'FIRST', '2024-09-01', '2025-02-28', true),
('09e8d221-0e2c-4a43-9857-7486e40da1ad', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'SECOND', '2025-03-01', NULL, true),
('138e9175-e7c6-4c53-a995-31106ead6307', 'a6586a8a-dfe7-4749-a3db-e876afb27dee', 'FIRST', '2022-09-01', '2023-02-28', false),
('519e249b-a26e-48ef-9193-75d8221c8460', 'a6586a8a-dfe7-4749-a3db-e876afb27dee', 'SECOND', '2023-03-01', '2023-08-31', false),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a520', '42a671d3-dcb9-4bd1-89c7-39345573480b', 'FIRST', '2025-09-01', NULL, true),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a521', '42a671d3-dcb9-4bd1-89c7-39345573480b', 'SECOND', '2026-03-01', NULL, false),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a522', 'fdce5e2c-2a6f-4bfd-bb44-d716bcdd4b3f', 'FIRST', '2021-09-01', '2022-02-28', false),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a523', 'fdce5e2c-2a6f-4bfd-bb44-d716bcdd4b3f', 'SECOND', '2022-03-01', '2022-08-31', false);

-- 6. Course (6)
INSERT INTO course (id, name, code, overview, level, department_id) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a524', 'Database Systems', 'CSC401', 'Advanced database concepts', 400, '6a218821-ce95-482a-9652-e85baf973833'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a525', 'Data Structures', 'CSC301', 'Algorithms and data structures', 300, '6a218821-ce95-482a-9652-e85baf973833'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a526', 'Circuit Theory', 'EEE301', 'Basic electrical circuits', 300, 'e4d512c0-c2ab-4fde-bf88-28640a56438e'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a527', 'Thermodynamics', 'MEE401', 'Heat and energy transfer', 400, '969a2267-8f74-4dbd-9370-a48f5ae02406'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a528', 'Web Programming', 'CSC402', 'Modern web technologies', 400, '3b64a4f7-634b-4a7e-9d92-2ce51e466ce5'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a529', 'Operating Systems', 'CSC302', 'OS concepts and design', 300, '6a218821-ce95-482a-9652-e85baf973833');

-- 7. Users (5 lecturers + 6 students)
INSERT INTO "user" (id, first_name, last_name, email, phone_number, password, user_type, department_id, created_at, updated_at) VALUES
-- Lecturers
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a530', 'John', 'Doe', 'john.doe@university.com', '08012345678', '$2b$12$examplehashedpassword', 'LECTURER', '6a218821-ce95-482a-9652-e85baf973833', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a531', 'Mary', 'Smith', 'mary.smith@university.com', '08023456789', '$2b$12$examplehashedpassword', 'LECTURER', '6a218821-ce95-482a-9652-e85baf973833', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a532', 'Ahmed', 'Bello', 'ahmed.bello@university.com', '08034567890', '$2b$12$examplehashedpassword', 'LECTURER', 'e4d512c0-c2ab-4fde-bf88-28640a56438e', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a533', 'Grace', 'Okafor', 'grace.okafor@university.com', '08045678901', '$2b$12$examplehashedpassword', 'LECTURER', '969a2267-8f74-4dbd-9370-a48f5ae02406', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a534', 'David', 'Okonkwo', 'david.okonkwo@university.com', '08056789012', '$2b$12$examplehashedpassword', 'LECTURER', '3b64a4f7-634b-4a7e-9d92-2ce51e466ce5', now(), now()),
-- Students
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a535', 'Alice', 'Johnson', 'alice.j@university.com', '08111111111', '$2b$12$examplehashedpassword', 'STUDENT', '6a218821-ce95-482a-9652-e85baf973833', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a536', 'Bob', 'Williams', 'bob.w@university.com', '08122222222', '$2b$12$examplehashedpassword', 'STUDENT', '6a218821-ce95-482a-9652-e85baf973833', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a537', 'Chioma', 'Eze', 'chioma.e@university.com', '08133333333', '$2b$12$examplehashedpassword', 'STUDENT', 'e4d512c0-c2ab-4fde-bf88-28640a56438e', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a538', 'Tunde', 'Ade', 'tunde.a@university.com', '08144444444', '$2b$12$examplehashedpassword', 'STUDENT', '969a2267-8f74-4dbd-9370-a48f5ae02406', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a539', 'Fatima', 'Yusuf', 'fatima.y@university.com', '08155555555', '$2b$12$examplehashedpassword', 'STUDENT', '6a218821-ce95-482a-9652-e85baf973833', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a540', 'Emeka', 'Ndu', 'emeka.n@university.com', '08166666666', '$2b$12$examplehashedpassword', 'STUDENT', '3b64a4f7-634b-4a7e-9d92-2ce51e466ce5', now(), now());

-- 8. LecturerProfile (5)
INSERT INTO lecturer_profile (id, user_id, rank, title, degree, status) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a530', 'SENIOR_LECTURER', 'DR', 'PHD', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a542', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a531', 'LECTURER_I', 'MR', 'PHD', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a543', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a532', 'ASSOCIATE_PROFESSOR', 'PROF', 'PHD', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a544', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a533', 'LECTURER_II', 'MRS', 'MASTER', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a545', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a534', 'SENIOR_LECTURER', 'ENGR', 'PHD', 'ACTIVE');

-- 9. StudentProfile (6)
INSERT INTO student_profile (id, user_id, matric_number, admission_session_id, status) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a535', 'U123456', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a547', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a536', 'U123457', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a548', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a537', 'U123458', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a549', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a538', 'U123459', '24ab8294-a0de-40e2-95ca-f3061c66fe85', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a550', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a539', 'U123460', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'ACTIVE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a551', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a540', 'U123461', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', 'ACTIVE');

-- 10. CourseOffering (5)
INSERT INTO course_offering (id, course_id, semester_id, session_id, is_active, class_completed) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a524', '875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', true, 0),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a525', '875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', true, 0),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a526', '875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', true, 0),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a555', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a527', '875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', true, 0),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a556', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a528', '875af634-6a41-449b-b466-3e3a8bc4d528', '5308da1e-a0b1-4daf-b057-bcf7a7dacb39', true, 0);

-- 11. CourseLecturer (5)
INSERT INTO course_lecturer (id, lecturer_id, course_offering_id, class_completed, status, assigned_at) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a557', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 0, NULL, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a558', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a542', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 0, NULL, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a559', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a543', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 0, NULL, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a560', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a544', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a555', 0, NULL, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a561', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a545', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a556', 0, NULL, now());

-- 12. CourseStudent (10 enrollments)
INSERT INTO course_student (id, student_id, course_offering_id, class_completed, registered_at) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a562', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a563', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a547', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a564', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a550', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a565', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a551', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a566', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a567', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a547', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a568', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a549', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a569', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a548', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a570', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a549', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 0, now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a571', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a551', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 0, now());

-- 13. ClassSession (5)
INSERT INTO class_session (id, course_offering_id, lecturer_id, status, start, "end") VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a572', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'UPCOMING', '2025-01-10 08:00:00+00', '2025-01-10 10:00:00+00'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a573', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a542', 'UPCOMING', '2025-01-11 10:00:00+00', '2025-01-11 12:00:00+00'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a574', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a543', 'ONGOING', '2025-01-05 14:00:00+00', '2025-01-05 16:00:00+00'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a575', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'COMPLETED', '2024-12-20 08:00:00+00', '2024-12-20 10:00:00+00'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a576', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a556', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a545', 'UPCOMING', '2025-01-15 13:00:00+00', '2025-01-15 15:00:00+00');

-- 14. Attendance (3)
INSERT INTO attendance (id, class_session_id, marked_at, student_id, status) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a577', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a575', now(), 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'COMPLETED'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a578', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a575', now(), 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a547', 'COMPLETED'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a579', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a575', now(), 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a550', 'EXCUSED');

-- 15. Message (3)
INSERT INTO message (id, course_offering_id, lecturer_id, title, details, created_at, updated_at) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a580', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'Welcome to Database Systems', 'Course outline and expectations', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a582', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a554', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a543', 'Lab Safety Reminder', 'Always wear protective gear', now(), now());
-- 16. Task (3)
INSERT INTO task (id, course_offering_id, task_type, lecturer_id, title, details, status, deadline, created_at, updated_at) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a583', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ASSIGNMENT', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'SQL Queries Assignment', 'Solve problems 1-10', 'UPCOMING', '2025-01-20 23:59:59+00', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a584', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a553', 'PROJECT', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a542', 'Linked List Implementation', 'Build a generic linked list', 'UPCOMING', '2025-02-15 23:59:59+00', now(), now()),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a585', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a552', 'ASSIGNMENT', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a541', 'Normalization Exercise', 'Normalize the given schema', 'UPCOMING', '2025-01-25 23:59:59+00', now(), now());
-- 17. TaskStudent (3)
INSERT INTO task_student (id, task_id, student_id, status) VALUES
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a586', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a583', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'COMPLETED'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a587', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a583', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a547', 'COMPLETED_LATE'),
('ba4e1fc6-f8e9-4172-bb2b-d9532e29a588', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a584', 'ba4e1fc6-f8e9-4172-bb2b-d9532e29a546', 'PENDING');

