-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bank1
-- ------------------------------------------------------
-- Server version	8.0.32

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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,11,69.00,'3214123412'),(2,34,32.00,'346234234634'),(62,72,86987.00,'7777947762359'),(63,73,56539546.00,'7777482839414'),(64,74,20390.00,'7777163838342');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
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
INSERT INTO `k_oscz` VALUES (125,63,0.0000,0.05),(126,62,102.1120,0.05);
/*!40000 ALTER TABLE `k_oscz` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,34,72,'agfgs','sfsdf','2023-08-23 21:45:18'),(2,34,72,'awert adf','radfs','2023-08-23 21:47:34'),(3,34,72,'wer','werw','2023-08-23 21:50:49'),(4,34,72,'fsd','df','2023-08-23 22:05:24'),(5,34,72,'fsd','df','2023-08-23 22:06:37'),(6,34,72,'fsd','df','2023-08-23 22:06:44'),(7,34,72,'fasd','sfdsdf','2023-08-23 22:07:17'),(8,34,72,'SDSDF','afdsdf','2023-08-23 22:11:16'),(9,34,72,'SDFsd','sdfsdf','2023-08-23 22:14:11'),(10,34,72,'serrtfge','erter','2023-08-23 22:16:30'),(11,34,72,'serrtfge','erter','2023-08-23 22:20:46'),(12,34,72,'serrtfge','erter','2023-08-23 22:25:32'),(13,34,72,'sdfs','dfsfs','2023-08-23 22:25:58'),(14,34,72,'asdsdf','asdfds','2023-08-23 22:26:40'),(15,34,72,'w3wer','ertertt','2023-08-23 22:28:07'),(16,34,72,'tgyhu','gyhhgy','2023-08-23 22:30:23'),(17,34,72,'fghf','dfghdf','2023-08-23 22:31:37'),(18,34,72,'tgyhu','gyhhgy','2023-08-23 22:40:00'),(19,34,72,'asdas','sdadasd','2023-08-23 22:43:23');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reg_request`
--

LOCK TABLES `reg_request` WRITE;
/*!40000 ALTER TABLE `reg_request` DISABLE KEYS */;
INSERT INTO `reg_request` VALUES (11,'Admin','321321321','koc@koc','mateudz','kOCON','KOWALAL',123521432,'$2b$10$TVkW8d8mJSQKRekByWbhIe2MMBvtMcEHZ4d6HgTtYhgazurdCzrSu','admin'),(34,'admin','23123123','zbyszek@123','Zbyszek','Krawczyk','Grazyna',64444432,'$2a$08$e/62r7GFhx4lQ1zNQGAEHe4lFz7ZYXpu5XhCrW5q3O33uCQsFeW72','admin'),(72,'Jan','41512342341','dasd@dsadasd','Jan','Nowak','Wacława',543252335,'$2a$08$kaZoP.eDGDd6y7/HyCAUb.HcsJB2pxGwtVo0Z7idWaMguPJDFE9e6','user'),(73,'Mateusz','42353534663','amt@fdsdf','Mateusz','Kowal','Tulpa',123542353,'$2a$08$xnSzW1nHZl/mZd2ta/b0kejOeX9xwatqCLq2yGCUIJVfBSeX3y7Fq','user'),(74,'Stanislaw','65234234634','sdf@fasdf','Stanisław','Wielki','Wacława',543253345,'$2a$08$L/5WnzKK8FwGFwaVYM65WeDPKx8yPkXbqnnEyiufp8aXXyT4bOHgu','user');
/*!40000 ALTER TABLE `reg_request` ENABLE KEYS */;
UNLOCK TABLES;

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
  `descrip` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `recipient_id` (`recipient_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `reg_request` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `reg_request` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (43,72,74,100.00,'7777947762359','7777163838342','Opis','2023-06-11 13:02:04'),(44,72,74,12313.00,'7777947762359','7777163838342','Opis','2023-06-11 13:02:10');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-24 15:11:36
