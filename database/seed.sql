PRAGMA foreign_keys = ON;

DELETE FROM audit_trail;
DELETE FROM updates;
DELETE FROM tasks;
DELETE FROM users;

-- Passwords:
-- viewer@mail.com    / viewer123
-- contrib@mail.com   / contrib123
-- mod@mail.com       / mod123

INSERT INTO users (email, password, role) VALUES
('viewer@mail.com',
 'a842bc0571d368a5269a71a59ba0db17:7b877d3020e3f67c5e7802f84fefbea1b5ec9a73a0ce255874bc91d7d12819e0dbf12a7f0e140eefbb7adaf13d1fb8eb5051a48e6c0d3995375f8e440a75c485',
 'viewer'),
('contrib@mail.com',
 'e5e79ed1edff005e93a0713c9b5a178a:e2aa4f6c23a1eca84a92a6a068dd60fe263f0561b08fcd6c4d1c41c5d10db9794fdc4a1d31759a4715b348419f8882e46331092bd380367e8e8531eb12fe767e',
 'contributor'),
('mod@mail.com',
 '6e89519d1e7c41990f26f5dcbe6df28a:4e861bdf52869487c293645c85d3287526c3ef3c4b63637876afc876cc23de4c39d429c3a8675784c2799bc55d61adc00e81b2cfd32634b0ac09752ca60edc6b',
 'moderator');

INSERT INTO tasks (title, status, assignee_id, creator_id) VALUES
('Review PR #101', 'to do', 1, 2),
('Deploy sprint build', 'in progress', 2, 3);

INSERT INTO updates (task_id, author_id, body) VALUES
(1, 2, 'Created task and waiting for review'),
(2, 3, 'Deployment to staging in progress');

INSERT INTO audit_trail (user_id, action, entity, entity_id, metadata)
VALUES
(2, 'create', 'task', 1, '{"title":"Review PR #101"}'),
(3, 'create', 'task', 2, '{"title":"Deploy sprint build"}');
