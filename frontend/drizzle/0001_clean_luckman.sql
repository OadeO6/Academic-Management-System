CREATE TABLE `academicSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` varchar(9) NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`isActive` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `academicSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `academicSessions_year_unique` UNIQUE(`year`)
);
--> statement-breakpoint
CREATE TABLE `aiChatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseOfferingId` int NOT NULL,
	`messages` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiChatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiTutorConfigs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseOfferingId` int NOT NULL,
	`instructions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiTutorConfigs_id` PRIMARY KEY(`id`),
	CONSTRAINT `aiTutorConfigs_courseOfferingId_unique` UNIQUE(`courseOfferingId`)
);
--> statement-breakpoint
CREATE TABLE `announcementViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`announcementId` int NOT NULL,
	`studentId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `announcementViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseOfferingId` int NOT NULL,
	`lecturerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`postedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignmentSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`studentId` int NOT NULL,
	`submissionUrl` varchar(500) NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('submitted','graded','returned') DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignmentSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseOfferingId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp NOT NULL,
	`totalPoints` int DEFAULT 100,
	`enableAiGrading` boolean DEFAULT false,
	`markingGuideUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`sessionId` int NOT NULL,
	`status` enum('present','absent','excused') NOT NULL,
	`markedAt` timestamp NOT NULL DEFAULT (now()),
	`markedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseDefinitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmentId` int NOT NULL,
	`code` varchar(20) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`creditUnits` int NOT NULL,
	`level` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseDefinitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseOfferingId` int NOT NULL,
	`enrollmentDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('active','dropped','completed') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseEnrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseMaterials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseOfferingId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`fileUrl` varchar(500) NOT NULL,
	`visibility` enum('students','ai','both') DEFAULT 'both',
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseMaterials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseOfferings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseDefinitionId` int NOT NULL,
	`semesterId` int NOT NULL,
	`lecturerId` int,
	`capacity` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseOfferings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseOfferingId` int NOT NULL,
	`sessionNumber` int NOT NULL,
	`scheduledDate` date NOT NULL,
	`startTime` varchar(5),
	`endTime` varchar(5),
	`location` varchar(255),
	`status` enum('scheduled','completed','cancelled') DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`facultyId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`hodId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faculties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faculties_id` PRIMARY KEY(`id`),
	CONSTRAINT `faculties_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `gradebooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseOfferingId` int NOT NULL,
	`totalPoints` decimal(7,2) DEFAULT 0,
	`totalPercentage` decimal(5,2) DEFAULT 0,
	`letterGrade` varchar(2),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gradebooks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submissionId` int NOT NULL,
	`points` decimal(5,2) NOT NULL,
	`percentage` decimal(5,2) NOT NULL,
	`feedback` text,
	`gradedBy` int,
	`gradingMethod` enum('manual','ai','ai_reviewed') NOT NULL,
	`gradedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grades_id` PRIMARY KEY(`id`),
	CONSTRAINT `grades_submissionId_unique` UNIQUE(`submissionId`)
);
--> statement-breakpoint
CREATE TABLE `lecturerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`staffId` varchar(64) NOT NULL,
	`departmentId` int NOT NULL,
	`title` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lecturerProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `lecturerProfiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `lecturerProfiles_staffId_unique` UNIQUE(`staffId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('assignment_created','assignment_due_soon','grade_released','attendance_warning','announcement','submission_received','ai_grading_ready') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`relatedEntityId` int,
	`relatedEntityType` varchar(50),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` int NOT NULL,
	`number` enum('1','2') NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`isActive` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `semesters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`matricNumber` varchar(64) NOT NULL,
	`departmentId` int NOT NULL,
	`level` int NOT NULL,
	`levelOffset` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentProfiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `studentProfiles_matricNumber_unique` UNIQUE(`matricNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('student','lecturer','hod','admin') NOT NULL DEFAULT 'student';--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);