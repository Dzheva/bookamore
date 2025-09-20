--################
-- Insert users
--################
INSERT INTO users (created_date, id, uuid, last_modified_date, email, name, password) VALUES
(NOW(), 1, '4f9df656-218a-413f-b9f8-81c471dbcb4d', NOW(), 'john.doe@example.com', 'John', '$2a$10$jffLzQglZFxgmWZnowGHVOonKz23d98sGmUvb4Mkr1TYjFa54C.Dy'),  -- password: "myPassword123"
(NOW(), 2, '5bb285d9-52d5-4364-bb3b-61c609eb2711', NOW(), 'jane.smith@example.com', 'Jane', '$2a$10$z1WEUVqtwdO7qW1enYaQxeP5kVJrQWU/eaxTZP4o3/xCwBOfXe/nS'), -- password: "myPassword123"
(NOW(), 3, 'b5c6a8e1-a5cd-4dc9-af64-02db880ff104', NOW(), 'mike.johnson@example.com', 'Mike', '$2a$10$DbWcjZTeLurHvWjB4Vq32uOA82YeUIS0XWHVdZ3zNa13W4NJj.ff.'), -- password: "myPassword123"
(NOW(), 4, 'e55bebd8-75ad-4821-beff-47d2324abf3a', NOW(), 'sarah.williams@example.com', 'Sarah', '$2a$10$VsAlph6j0w0IPflwq9umCuZHvRMUjbasPYeG/.R0NXNH.DNOPXP/2'), -- password: "myPassword123"
(NOW(), 5, '7e2ee2c5-bba1-4e19-9e67-6f68d915ba58', NOW(), 'david.brown@example.com', 'David', '$2a$10$G.31YSoEEpL71aRIkQj1qOw1iuhLoxmW61eWAHPjyQD.ZxcNqgOuS'); -- password: "myPassword123"
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
-- END Insert users
-------------------------------------------------------------------

--################
-- Insert offers
--################
-- books
INSERT INTO books (year_of_release, created_date, id, last_modified_date, description, condition, isbn, title) VALUES
(2018, NOW(), 1,  NOW(), 'Best practices for the Java platform.', 'NEW', '9780134685991', 'Effective Java'),
(2018, NOW(), 2,  NOW(), 'Comprehensive guide to Spring Framework.', 'AS_NEW', '9781617294945', 'Spring in Action'),
(1999, NOW(), 3,  NOW(), 'Your journey to mastery.', 'NEW', '9780135957059', 'The Pragmatic Programmer'),
(1994, NOW(), 4,  NOW(), 'Elements of reusable object-oriented software.', 'USED', '9780201633610', 'Design Patterns'),
(2004, NOW(), 5,  NOW(), 'A brain-friendly guide.', 'USED', '9780596007126', 'Head First Design Patterns'),
(1999, NOW(), 6,  NOW(), 'Improving the design of existing code.', 'AS_NEW', '9780134757599', 'Refactoring'),
(2006, NOW(), 7,  NOW(), 'Concurrency best practices for Java.', 'NEW', '9780321349606', 'Java Concurrency in Practice'),
(2015, NOW(), 8,  NOW(), 'A deep dive into JavaScript.', 'USED', '9781491904244', 'You Don''t Know JS'),
(2017, NOW(), 9,  NOW(), 'A practical guide to Kotlin.', 'NEW', '9781617293290', 'Kotlin in Action'),
(2002, NOW(), 10, NOW(), 'By example with Java and JUnit.', 'AS_NEW', '9780321146533', 'Test Driven Development'),
(2018, NOW(), 11, NOW(), 'A comprehensive guide to microservice architecture.', 'AS_NEW', '9781617294549', 'Microservices Patterns'),
(2011, NOW(), 12, NOW(), 'Fourth edition covering algorithms in depth.', 'NEW', '9780321573513', 'Algorithms'),
(2016, NOW(), 13, NOW(), 'An illustrated guide for beginners.', 'USED', '9781617292231', 'Grokking Algorithms'),
(2012, NOW(), 14, NOW(), 'A complete introduction to Bash and shell scripting.', 'NEW', '9781593273897', 'Linux Command Line'),
(2008, NOW(), 15, NOW(), 'A Handbook of Agile Software Craftsmanship.', 'USED', '9780132350884', 'Clean Code');
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- authors
INSERT INTO authors (created_date, id, last_modified_date, name) VALUES
( NOW(),  1, NOW(), 'Joshua Bloch'),
( NOW(),  2, NOW(), 'Craig Walls'),
( NOW(),  3, NOW(), 'Andrew Hunt'),
( NOW(),  4, NOW(), 'David Thomas'),
( NOW(),  5, NOW(), 'Erich Gamma'),
( NOW(),  6, NOW(), 'Richard Helm'),
( NOW(),  7, NOW(), 'Ralph Johnson'),
( NOW(),  8, NOW(), 'John Vlissides'),
( NOW(),  9, NOW(), 'Eric Freeman'),
( NOW(), 10, NOW(), 'Elisabeth Robson'),
( NOW(), 11, NOW(), 'Martin Fowler'),
( NOW(), 12, NOW(), 'Brian Goetz'),
( NOW(), 13, NOW(), 'Kyle Simpson'),
( NOW(), 14, NOW(), 'Dmitry Jemerov'),
( NOW(), 15, NOW(), 'Svetlana Isakova'),
( NOW(), 16, NOW(), 'Kent Beck'),
( NOW(), 17, NOW(), 'Chris Richardson'),
( NOW(), 18, NOW(), 'Robert Sedgewick'),
( NOW(), 19, NOW(), 'Kevin Wayne'),
( NOW(), 20, NOW(), 'Aditya Bhargava'),
( NOW(), 21, NOW(), 'William Shotts'),
( NOW(), 22, NOW(), 'Robert C. Martin');
SELECT setval('authors_id_seq', (SELECT MAX(id) FROM authors));

-- authors books relations
INSERT INTO books_authors (author_id, book_id) VALUES
( 1,  1), ( 2,  2), ( 3,  3), ( 4,  3), ( 5,  4), ( 6,  4), ( 7,  4), ( 8,  4), ( 9,  5), (10,  5),
(11,  6), (12,  7), (13,  8), (14,  9), (15,  9), (16, 10), (17, 11), (18, 12), (19, 12), (20, 13), (21, 14), (22, 15);

-- genres
INSERT INTO genres (created_date, id, last_modified_date, name) VALUES
(NOW(),  1, NOW(), 'Programming'),
(NOW(),  2, NOW(), 'Java'),
(NOW(),  3, NOW(), 'Spring'),
(NOW(),  4, NOW(), 'Career'),
(NOW(),  5, NOW(), 'Software Design'),
(NOW(),  6, NOW(), 'Architecture'),
(NOW(),  7, NOW(), 'Refactoring'),
(NOW(),  8, NOW(), 'Clean Code'),
(NOW(),  9, NOW(), 'Concurrency'),
(NOW(), 10, NOW(), 'JavaScript'),
(NOW(), 11, NOW(), 'Kotlin'),
(NOW(), 12, NOW(), 'Testing'),
(NOW(), 13, NOW(), 'TDD'),
(NOW(), 14, NOW(), 'Microservices'),
(NOW(), 15, NOW(), 'Algorithms'),
(NOW(), 16, NOW(), 'Computer Science'),
(NOW(), 17, NOW(), 'Beginner'),
(NOW(), 18, NOW(), 'Linux'),
(NOW(), 19, NOW(), 'Shell'),
(NOW(), 20, NOW(), 'Software Engineering');
SELECT setval('genres_id_seq', (SELECT MAX(id) FROM genres));

-- genres books relations
INSERT INTO books_genres (book_id, genre_id) VALUES
( 1,  1), ( 1,  2), ( 2,  3), ( 2,  2), ( 3,  1), ( 3,  4), ( 4,  5), ( 4,  6), ( 5,  5), ( 5,  2), ( 6,  7), ( 6,  8),
( 7,  9), ( 7,  2), ( 8, 10), ( 8,  1), ( 9, 11), ( 9,  1), (10, 12), (10, 13), (11, 14), (11,  6), (12, 15), (12, 16),
(13, 15), (13, 17), (14, 18), (14, 19), (15,  1), (15, 20);

-- books images
INSERT INTO books_images ( book_id, created_date, id, last_modified_date, path) VALUES
( 1, NOW(),  1, NOW(), '/images/effective_java.jpg'),
( 2, NOW(),  2, NOW(), '/images/spring_in_action.jpg'),
( 3, NOW(),  3, NOW(), '/images/pragmatic_programmer.jpg'),
( 4, NOW(),  4, NOW(), '/images/design_patterns.jpg'),
( 5, NOW(),  5, NOW(), '/images/head_first_dp.jpg'),
( 6, NOW(),  6, NOW(), '/images/refactoring.jpg'),
( 7, NOW(),  7, NOW(), '/images/java_concurrency.jpg'),
( 8, NOW(),  8, NOW(), '/images/ydkjs.jpg'),
( 9, NOW(),  9, NOW(), '/images/kotlin_in_action.jpg'),
(10, NOW(), 10, NOW(), '/images/tdd_by_example.jpg'),
(11, NOW(), 11, NOW(), '/images/microservices_patterns.jpg'),
(12, NOW(), 12, NOW(), '/images/algorithms.jpg'),
(13, NOW(), 13, NOW(), '/images/grokking_algorithms.jpg'),
(14, NOW(), 14, NOW(), '/images/linux_command_line.jpg'),
(15, NOW(), 15, NOW(), '/images/clean_code.jpg');
SELECT setval('books_images_id_seq', (SELECT MAX(id) FROM books_images));

-- offers
INSERT INTO offers
 (price, book_id, created_date, id, last_modified_date, seller_id, description, preview_image, status, type)
VALUES
(45.99, 1, NOW(), 1, NOW(), 1, 'Like new condition, barely used', '/images/offers/effective_java.jpg', 'CLOSED', 'SELL_EXCHANGE'),
(32.50, 2, NOW(), 2, NOW(), 2, 'Excellent condition with no markings', '/images/offers/spring_in_action.jpg', 'HIDDEN', 'SELL'),
(28.75, 4, NOW(), 3, NOW(), 3, 'Classic book, some wear but fully readable', '/images/offers/design_patterns.jpg', 'OPEN', 'EXCHANGE'),
(22.00, 13, NOW(), 4, NOW(), 4, 'Perfect for beginners, includes my notes', '/images/offers/grokking_algorithms.jpg', 'OPEN', 'SELL'),
(55.25, 15, NOW(), 5, NOW(), 5, 'Mint condition, never opened', '/images/offers/clean_code.jpg', 'OPEN', 'SELL');
SELECT setval('offers_id_seq', (SELECT MAX(id) FROM offers));

-- END Insert offers
-------------------------------------------------------------------
