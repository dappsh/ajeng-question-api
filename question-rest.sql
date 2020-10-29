CREATE DATABASE IF NOT EXISTS `question-rest`;
USE `question-rest`;


-- Table structure for option
DROP TABLE IF EXISTS `respondent_option`;
CREATE TABLE `respondent_option` (
  `id` int (9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (id)
);


INSERT INTO `respondent_option` (`id`, `name`) VALUES
(1, 'May Select'),
(2, 'Must Select'),
(3, 'Terminate');


-- Table structure for questions
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` int (9) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `allow_none` boolean NOT NULL DEFAULT 0,
  `shuffle_order` boolean NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  PRIMARY KEY (id)
);


INSERT INTO `questions` (`id`, `question`, `allow_none`, `shuffle_order`, `created_at`, `updated_at`) VALUES
(1,'What is your name?', TRUE,  FALSE, '2018-04-22 13:57:30', '2018-04-22 13:57:00');

-- Table structure for respondent
DROP TABLE IF EXISTS `respondent`;
CREATE TABLE `respondent` (
  `id` int (9) NOT NULL AUTO_INCREMENT,
  `option_id` int,
  `question_id` int,
  `answer` varchar(255) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (option_id) 
    REFERENCES respondent_option(id),
  FOREIGN KEY (question_id) 
    REFERENCES questions(id)
    ON DELETE CASCADE
);


INSERT INTO `respondent` (`id`,`option_id`, `question_id`, `answer`) VALUES
(1, 3, 1, 'My name is Mapple Scribble Selection');
