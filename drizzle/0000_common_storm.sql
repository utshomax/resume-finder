CREATE TABLE "resumes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"current_job_title" varchar(200) NOT NULL,
	"current_job_description" text NOT NULL,
	"current_job_company" varchar(200) NOT NULL
);
