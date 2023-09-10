-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: bank1
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id_account` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bilans` decimal(20,2) DEFAULT NULL,
  `account_number` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_account`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `account_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `reg_request` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,11,69.00,'3214123412'),(2,34,32.00,'346234234634'),(62,72,159.00,'7777947762359'),(63,73,56538666.00,'7777482839414'),(64,74,20390.00,'7777163838342'),(65,75,1766.00,'7777217438113'),(66,76,1189.00,'7777997090356'),(67,78,994.00,'7777176200638');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `current_transfers`
--

DROP TABLE IF EXISTS `current_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `current_transfers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipient_account` varchar(255) NOT NULL,
  `sender_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transfer_interval` int NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_transfers`
--

LOCK TABLES `current_transfers` WRITE;
/*!40000 ALTER TABLE `current_transfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `current_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goals` (
  `id_goal` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `goal_name` varchar(255) NOT NULL,
  `description` text,
  `target_amount` decimal(20,2) NOT NULL,
  `current_amount` decimal(20,2) DEFAULT '0.00',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id_goal`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `reg_request` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES (4,72,'nowy cel','',1000.00,82.00,'2023-09-07','2023-09-30');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `withdraw_goal_transaction` AFTER UPDATE ON `goals` FOR EACH ROW BEGIN
  IF OLD.current_amount > NEW.current_amount THEN
    INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, title , descrip, created_at)
    VALUES (0, NEW.user_id , (OLD.current_amount - NEW.current_amount), 0, 0, CONCAT('Wypłata z celu ',new.goal_name ) ,CONCAT('Wypłata z celu ',new.goal_name ), NOW());
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `deposit_goal_transaction` AFTER UPDATE ON `goals` FOR EACH ROW BEGIN
  IF OLD.current_amount < NEW.current_amount THEN
    INSERT INTO transactions (sender_id, recipient_id, amount, sender_account_number, recipient_account_number, title , descrip, created_at)
    VALUES (NEW.user_id,0  , (OLD.current_amount - NEW.current_amount), 0, 0, CONCAT('Wpłata do celu ',new.goal_name ) ,CONCAT('Wpłata do celu ',new.goal_name ), NOW());
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `info`
--

DROP TABLE IF EXISTS `info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `info` (
  `id_info` int NOT NULL AUTO_INCREMENT,
  `user_login` varchar(55) NOT NULL,
  `user_id` int NOT NULL,
  `info_type` varchar(45) NOT NULL,
  `text` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_info`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info`
--

LOCK TABLES `info` WRITE;
/*!40000 ALTER TABLE `info` DISABLE KEYS */;
INSERT INTO `info` VALUES (1,'Ludwik',75,'Rejestraacja użytkownia','Uzytkownik Ludwik Założył konto w banku','2023-09-02 14:55:24'),(2,'Jan',72,'Zmiana email','Użytkownik Jan zmienił email z dasd@dsadasd na jsajsaaed@dfsf','2023-09-02 14:58:14'),(3,'Witold',76,'Rejestraacja użytkownia','Uzytkownik Witold Założył konto w banku','2023-09-02 15:01:08'),(4,'Witold123',78,'Rejestraacja użytkownia','Uzytkownik Witold123 Założył konto w banku','2023-09-02 15:02:47'),(5,'test',79,'Rejestraacja użytkownia','Uzytkownik test Założył konto w banku','2023-09-07 12:34:40');
/*!40000 ALTER TABLE `info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `k_oscz`
--

DROP TABLE IF EXISTS `k_oscz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `k_oscz` (
  `id_oszcz` int NOT NULL AUTO_INCREMENT,
  `id_account` int DEFAULT NULL,
  `wplacone_srodki` decimal(20,4) DEFAULT NULL,
  `oprocentowanie` float DEFAULT NULL,
  PRIMARY KEY (`id_oszcz`),
  KEY `id_account` (`id_account`),
  CONSTRAINT `k_oscz_ibfk_1` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `k_oscz`
--

LOCK TABLES `k_oscz` WRITE;
/*!40000 ALTER TABLE `k_oscz` DISABLE KEYS */;
INSERT INTO `k_oscz` VALUES (125,63,0.0000,0.05),(126,62,113.4175,0.05);
/*!40000 ALTER TABLE `k_oscz` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `k_oscz_after_insert` AFTER INSERT ON `k_oscz` FOR EACH ROW BEGIN
  INSERT INTO info (user_login, user_id, info_type, text, created_at)
  SELECT (SELECT login FROM reg_request WHERE id = a.user_id), a.user_id, 'Nowe konto oszczędnościowe', CONCAT('Użytkownik ', (SELECT login FROM reg_request WHERE id = a.user_id), ' storzył nowe konto oszczędnościowe'), NOW()
  FROM account a
  WHERE a.id_account = NEW.id_account;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_nadawcy` int NOT NULL,
  `id_odbiorcy` int NOT NULL,
  `naglowek` text NOT NULL,
  `tresc` text NOT NULL,
  `wyslano_o` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_nadawcy` (`id_nadawcy`),
  KEY `id_odbiorcy` (`id_odbiorcy`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`id_nadawcy`) REFERENCES `reg_request` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`id_odbiorcy`) REFERENCES `reg_request` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (20,34,72,'Witam w banku','Witam i o zdrowie pytam','2023-09-07 12:01:53');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opinie`
--

DROP TABLE IF EXISTS `opinie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opinie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data_wystawienia` datetime DEFAULT NULL,
  `ocena` int DEFAULT NULL,
  `tresc` text,
  `uzytkownik_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uzytkownik_id` (`uzytkownik_id`),
  CONSTRAINT `opinie_ibfk_1` FOREIGN KEY (`uzytkownik_id`) REFERENCES `reg_request` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opinie`
--

LOCK TABLES `opinie` WRITE;
/*!40000 ALTER TABLE `opinie` DISABLE KEYS */;
INSERT INTO `opinie` VALUES (1,'2023-09-09 13:45:31',5,'232',72),(2,'2023-09-09 13:46:38',2,'233',72),(3,'2023-09-09 13:47:51',3,'dsds',72),(4,'2023-09-09 13:49:46',5,'SDS',72),(5,'2023-09-09 13:50:25',4,'DSD',72),(6,'2023-09-09 13:51:58',1,'Super ;)',72),(7,'2023-09-09 13:52:09',1,'Super ;)',72),(8,'2023-09-09 13:52:47',1,'Super ;)',72),(9,'2023-09-09 13:52:52',3,'',72),(10,'2023-09-09 14:01:02',3,'SDS',NULL);
/*!40000 ALTER TABLE `opinie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reg_request`
--

DROP TABLE IF EXISTS `reg_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reg_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `login` varchar(555) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `pesel` varchar(11) NOT NULL,
  `email` text NOT NULL,
  `firstName` text NOT NULL,
  `lastName` text NOT NULL,
  `motherName` text NOT NULL,
  `phonenumber` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT NULL,
  PRIMARY KEY (`id`,`pesel`),
  UNIQUE KEY `pesel_UNIQUE` (`pesel`),
  UNIQUE KEY `login_UNIQUE` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reg_request`
--

LOCK TABLES `reg_request` WRITE;
/*!40000 ALTER TABLE `reg_request` DISABLE KEYS */;
INSERT INTO `reg_request` VALUES (11,'Admin','321321321','koc@koc','mateudz','kOCON','KOWALAL',123521432,'$2b$10$TVkW8d8mJSQKRekByWbhIe2MMBvtMcEHZ4d6HgTtYhgazurdCzrSu','admin'),(34,'admin','23123123','zbyszek@123','Zbyszek','Krawczyk','Grazyna',64444432,'$2a$08$e/62r7GFhx4lQ1zNQGAEHe4lFz7ZYXpu5XhCrW5q3O33uCQsFeW72','admin'),(72,'Jan','41512342341','jsajsaaed@dfsf','Jan','Nowak','Wacława',543252335,'$2a$08$kaZoP.eDGDd6y7/HyCAUb.HcsJB2pxGwtVo0Z7idWaMguPJDFE9e6','user'),(73,'Mateusz','42353534663','amt@fdsdf','Mateusz','Kowal','Tulpa',123542353,'$2a$08$xnSzW1nHZl/mZd2ta/b0kejOeX9xwatqCLq2yGCUIJVfBSeX3y7Fq','user'),(74,'Stanislaw','65234234634','sdf@fasdf','Stanisław','Wielki','Wacława',543253345,'$2a$08$L/5WnzKK8FwGFwaVYM65WeDPKx8yPkXbqnnEyiufp8aXXyT4bOHgu','user'),(75,'Ludwik','45321312431','ludwik@luc.c','Ludwik','wielki','małą',543534443,'$2a$08$KXQeEcwuD.ZvXAkogoiGY.zUDF5tGNF0IcfXvFfnbBt50CIeMpBP2','user'),(76,'Witold','02000231312','witolsdkoks@rtveuroagd.ru','Witold','Mito','UL',675456456,'$2a$08$xLDSdzJIN2sQti5FxbtWJuY427Qmm7yFVVnem8NGPHeSL8vPktq2C','user'),(78,'Witold123','02000031312','wit2olsdkoks@rtveuroagd.ru','Witold','Mitos','UL',675544566,'$2a$08$9VTK0GxQdW3fGGX0vQ0OS.UONKPP5nRC88AQxIU4oblrWYQ/toGxi','user'),(79,'test','0','0@0','0','0','0',9,'0','user');
/*!40000 ALTER TABLE `reg_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reg_request_after_insert` AFTER INSERT ON `reg_request` FOR EACH ROW BEGIN
  INSERT INTO info (user_login, user_id, info_type, text, created_at)
  VALUES (NEW.login, NEW.id, 'Rejestraacja użytkownia', CONCAT('Uzytkownik ',NEW.login,' Założył konto w banku'), NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reg_request_after_update_login` AFTER UPDATE ON `reg_request` FOR EACH ROW BEGIN
  IF OLD.login != NEW.login THEN
    INSERT INTO info (user_login, user_id, info_type, text, created_at)
    VALUES (NEW.login, NEW.id, 'Zmiana loginu', CONCAT('Użytkownik ', NEW.login, ' zmienił swój email z ', OLD.login, ' na ', NEW.login), NOW());
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reg_request_after_update_email` AFTER UPDATE ON `reg_request` FOR EACH ROW BEGIN
  IF OLD.email != NEW.email THEN
    INSERT INTO info (user_login, user_id, info_type, text, created_at)
    VALUES ((SELECT login FROM reg_request WHERE id = NEW.id), NEW.id, 'Zmiana email', CONCAT('Użytkownik ', NEW.login, ' zmienił email z ', OLD.email, ' na ', NEW.email), NOW());
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reg_request_after_update_password` AFTER UPDATE ON `reg_request` FOR EACH ROW BEGIN
  IF OLD.password != NEW.password THEN
    INSERT INTO info (user_login, user_id, info_type, text, created_at)
    VALUES ((SELECT login FROM reg_request WHERE id = NEW.id), NEW.id, 'Zmiana hasła', CONCAT('Użytkownik ', NEW.login, ' zmienił hasło'), NOW());
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `recipient_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `sender_account_number` varchar(26) NOT NULL,
  `recipient_account_number` varchar(26) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `descrip` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (43,72,74,100.00,'7777947762359','7777163838342','Przelew','Opis','2023-06-11 13:02:04'),(44,72,74,12313.00,'7777947762359','7777163838342','Przelew','Opis','2023-06-11 13:02:10'),(77,72,78,100.00,'7777947762359','7777176200638',NULL,'Opis','2023-09-07 10:12:36'),(86,72,0,-100.00,'0','0','Wpłata do celu nowy cel','Wpłata do celu nowy cel','2023-09-07 11:11:03'),(87,72,0,-1.00,'0','0','Wpłata do celu nowy cel','Wpłata do celu nowy cel','2023-09-07 11:15:37'),(89,72,0,-12.00,'0','0','Wpłata do celu nowy cel','Wpłata do celu nowy cel','2023-09-07 11:41:26'),(90,0,72,6.00,'0','0','Wypłata z celu nowy cel','Wypłata z celu nowy cel','2023-09-07 12:03:34');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `transactions_after_insert` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
  INSERT INTO info (user_login, user_id, info_type, text, created_at)
  SELECT (SELECT login FROM reg_request WHERE id = a.user_id), a.user_id, 'Nowa tranzakcja', CONCAT('Wykony został przelew o wartości ', NEW.amount, ' z Konta', NEW.sender_account_number, ' Do konta ', NEW.recipient_account_number), NOW()
  FROM account a
  WHERE a.id_account = NEW.sender_id OR a.id_account = NEW.recipient_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-10 17:43:39
