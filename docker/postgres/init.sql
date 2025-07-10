-- Initialize Tishya Foods database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create additional databases for different environments
CREATE DATABASE tishyafoods_test;
CREATE DATABASE tishyafoods_dev;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE tishyafoods TO postgres;
GRANT ALL PRIVILEGES ON DATABASE tishyafoods_test TO postgres;
GRANT ALL PRIVILEGES ON DATABASE tishyafoods_dev TO postgres;

-- Create a read-only user for analytics (optional)
CREATE USER analytics_user WITH PASSWORD 'analytics_password';
GRANT CONNECT ON DATABASE tishyafoods TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO analytics_user;