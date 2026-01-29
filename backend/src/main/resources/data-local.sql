--################
-- Insert users
--################
INSERT INTO users (created_date, id, last_modified_date, email, name, password) VALUES
                                                                                    (NOW(), '018d4f1a-5b03-71d4-a716-446655440001', NOW(), 'john.doe@example.com', 'John', '$2a$10$jffLzQglZFxgmWZnowGHVOonKz23d98sGmUvb4Mkr1TYjFa54C.Dy'),
                                                                                    (NOW(), '018d4f1a-5b03-71d4-a716-446655440002', NOW(), 'jane.smith@example.com', 'Jane', '$2a$10$z1WEUVqtwdO7qW1enYaQxeP5kVJrQWU/eaxTZP4o3/xCwBOfXe/nS'),
                                                                                    (NOW(), '018d4f1a-5b03-71d4-a716-446655440003', NOW(), 'mike.johnson@example.com', 'Mike', '$2a$10$DbWcjZTeLurHvWjB4Vq32uOA82YeUIS0XWHVdZ3zNa13W4NJj.ff.'),
                                                                                    (NOW(), '018d4f1a-5b03-71d4-a716-446655440004', NOW(), 'sarah.williams@example.com', 'Sarah', '$2a$10$VsAlph6j0w0IPflwq9umCuZHvRMUjbasPYeG/.R0NXNH.DNOPXP/2'),
                                                                                    (NOW(), '018d4f1a-5b03-71d4-a716-446655440005', NOW(), 'david.brown@example.com', 'David', '$2a$10$G.31YSoEEpL71aRIkQj1qOw1iuhLoxmW61eWAHPjyQD.ZxcNqgOuS');

--################
-- Insert authors
--################
INSERT INTO authors (created_date, id, last_modified_date, name) VALUES
                                                                     (NOW(), '018d4f1a-5b03-71d4-b001-000000000001', NOW(), 'Joshua Bloch'),
                                                                     (NOW(), '018d4f1a-5b03-71d4-b001-000000000002', NOW(), 'Craig Walls'),
                                                                     (NOW(), '018d4f1a-5b03-71d4-b001-000000000003', NOW(), 'Robert C. Martin');

--################
-- Insert books
--################
INSERT INTO books (year_of_release, created_date, id, last_modified_date, description, condition, isbn, title) VALUES
                                                                                                                   (2018, NOW(), '018d4f1a-5b03-71d4-c001-000000000001', NOW(), 'Best practices for the Java platform.', 'NEW', '9780134685991', 'Effective Java'),
                                                                                                                   (2018, NOW(), '018d4f1a-5b03-71d4-c001-000000000002', NOW(), 'Comprehensive guide to Spring Framework.', 'AS_NEW', '9781617294945', 'Spring in Action'),
                                                                                                                   (2008, NOW(), '018d4f1a-5b03-71d4-c001-000000000003', NOW(), 'A Handbook of Agile Software Craftsmanship.', 'USED', '9780132350884', 'Clean Code');

--################
-- Relations (Books-Authors)
--################
INSERT INTO books_authors (author_id, book_id) VALUES
                                                   ('018d4f1a-5b03-71d4-b001-000000000001', '018d4f1a-5b03-71d4-c001-000000000001'), -- Bloch -> Effective Java
                                                   ('018d4f1a-5b03-71d4-b001-000000000002', '018d4f1a-5b03-71d4-c001-000000000002'), -- Walls -> Spring in Action
                                                   ('018d4f1a-5b03-71d4-b001-000000000003', '018d4f1a-5b03-71d4-c001-000000000003'); -- Martin -> Clean Code

--################
-- Insert offers
--################
INSERT INTO offers (price, book_id, created_date, id, last_modified_date, seller_id, description, preview_image, status, type) VALUES
    (45.99, '018d4f1a-5b03-71d4-c001-000000000001', NOW(), '018d4f1a-5b03-71d4-e001-000000000001', NOW(), '018d4f1a-5b03-71d4-a716-446655440001', 'Like new condition', '/images/offers/effective_java.jpg', 'OPEN', 'SELL');