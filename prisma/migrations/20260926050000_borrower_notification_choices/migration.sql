ALTER TABLE "User" ADD COLUMN "borrowerEmailDefaults" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Closing" ADD COLUMN "borrowerEmailTypes" TEXT[] NOT NULL DEFAULT ARRAY['loan_locked', 'title_ordered', 'title_search', 'title_issued', 'closed']::TEXT[];
ALTER TABLE "User" ADD CONSTRAINT "User_borrowerEmailDefaults_valid"
  CHECK ("borrowerEmailDefaults" <@ ARRAY['title_ordered', 'title_search', 'title_issued', 'closed']::TEXT[]);
ALTER TABLE "Closing" ADD CONSTRAINT "Closing_borrowerEmailTypes_valid"
  CHECK ("borrowerEmailTypes" <@ ARRAY['loan_locked', 'title_ordered', 'title_search', 'title_issued', 'closed']::TEXT[]);
