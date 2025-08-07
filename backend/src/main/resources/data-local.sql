-- Insert books
INSERT INTO books (year_of_release, created_date, id, last_modified_date, description, condition, isbn, title) VALUES
(2018, '2025-08-07 15:19:11.125316', 1, '2025-08-07 15:19:11.125316', 'Best practices for the Java platform.', 'NEW', '9780134685991', 'Effective Java'),
(2018, '2025-08-07 15:19:11.14341', 2, '2025-08-07 15:19:11.14341', 'Comprehensive guide to Spring Framework.', 'AS_NEW', '9781617294945', 'Spring in Action'),
(1999, '2025-08-07 15:19:11.157686', 3, '2025-08-07 15:19:11.157686', 'Your journey to mastery.', 'NEW', '9780135957059', 'The Pragmatic Programmer'),
(1994, '2025-08-07 15:19:11.176774', 4, '2025-08-07 15:19:11.176774', 'Elements of reusable object-oriented software.', 'USED', '9780201633610', 'Design Patterns'),
(2004, '2025-08-07 15:19:11.18584', 5, '2025-08-07 15:19:11.18584', 'A brain-friendly guide.', 'USED', '9780596007126', 'Head First Design Patterns'),
(1999, '2025-08-07 15:19:11.195364', 6, '2025-08-07 15:19:11.195364', 'Improving the design of existing code.', 'AS_NEW', '9780134757599', 'Refactoring'),
(2006, '2025-08-07 15:19:11.203387', 7, '2025-08-07 15:19:11.203387', 'Concurrency best practices for Java.', 'NEW', '9780321349606', 'Java Concurrency in Practice'),
(2015, '2025-08-07 15:19:11.211409', 8, '2025-08-07 15:19:11.211409', 'A deep dive into JavaScript.', 'USED', '9781491904244', 'You Don''t Know JS'),
(2017, '2025-08-07 15:19:11.221916', 9, '2025-08-07 15:19:11.221916', 'A practical guide to Kotlin.', 'NEW', '9781617293290', 'Kotlin in Action'),
(2002, '2025-08-07 15:19:11.230326', 10, '2025-08-07 15:19:11.230326', 'By example with Java and JUnit.', 'AS_NEW', '9780321146533', 'Test Driven Development'),
(2018, '2025-08-07 15:19:11.23735', 11, '2025-08-07 15:19:11.23735', 'A comprehensive guide to microservice architecture.', 'AS_NEW', '9781617294549', 'Microservices Patterns'),
(2011, '2025-08-07 15:19:11.24858', 12, '2025-08-07 15:19:11.24858', 'Fourth edition covering algorithms in depth.', 'NEW', '9780321573513', 'Algorithms'),
(2016, '2025-08-07 15:19:11.255806', 13, '2025-08-07 15:19:11.255806', 'An illustrated guide for beginners.', 'USED', '9781617292231', 'Grokking Algorithms'),
(2012, '2025-08-07 15:19:11.263667', 14, '2025-08-07 15:19:11.263667', 'A complete introduction to Bash and shell scripting.', 'NEW', '9781593273897', 'Linux Command Line'),
(2008, '2025-08-07 15:54:53.08472', 15, '2025-08-07 15:54:53.08472', 'A Handbook of Agile Software Craftsmanship.', 'USED', '9780132350884', 'Clean Code');
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- Insert users
INSERT INTO users (created_date, id, last_modified_date, email, name, password, surname) VALUES
(NOW(), 1, NOW(), 'john.doe@example.com', 'John', '$2a$10$xJwL5vZz3VUqUZJZ5p5n.e5vO9jZ7JQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Doe'),
(NOW(), 2, NOW(), 'jane.smith@example.com', 'Jane', '$2a$10$yH9vZz3VUqUZJZ5p5n.e5vO9jZ7JQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Smith'),
(NOW(), 3, NOW(), 'mike.johnson@example.com', 'Mike', '$2a$10$zK8vZz3VUqUZJZ5p5n.e5vO9jZ7JQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Johnson'),
(NOW(), 4, NOW(), 'sarah.williams@example.com', 'Sarah', '$2a$10$wL2vZz3VUqUZJZ5p5n.e5vO9jZ7JQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Williams'),
(NOW(), 5, NOW(), 'david.brown@example.com', 'David', '$2a$10$vM3vZz3VUqUZJZ5p5n.e5vO9jZ7JQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 'Brown');
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));