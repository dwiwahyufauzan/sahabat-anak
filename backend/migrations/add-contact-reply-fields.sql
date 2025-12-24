-- Migration: Add reply fields to contact_messages table
-- Date: 2024
-- Description: Add columns for storing admin replies to contact messages

ALTER TABLE contact_messages 
ADD COLUMN reply TEXT,
ADD COLUMN replied_at TIMESTAMP,
ADD COLUMN replied_by INT,
ADD CONSTRAINT fk_contact_replied_by 
  FOREIGN KEY (replied_by) REFERENCES admins(id) 
  ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_replied_by ON contact_messages(replied_by);
