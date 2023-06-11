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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,11,10166.00,'22312342'),(2,34,34197.00,'7777760552170'),(35,35,64901.47,'7777711416026'),(37,37,407148.65,'7777438377440'),(49,55,100000.00,'7777330309955'),(51,57,5700.00,'7777533335380'),(60,70,4322324.00,'7777273111135'),(61,71,100000.00,'7777361050257');
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
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `k_oscz`
--

LOCK TABLES `k_oscz` WRITE;
/*!40000 ALTER TABLE `k_oscz` DISABLE KEYS */;
INSERT INTO `k_oscz` VALUES (124,35,1327.4958,0.05);
/*!40000 ALTER TABLE `k_oscz` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reg_request`
--

LOCK TABLES `reg_request` WRITE;
/*!40000 ALTER TABLE `reg_request` DISABLE KEYS */;
INSERT INTO `reg_request` VALUES (11,'Admin','321321321','koc@koc','mateudz','kOCON','KOWALAL',123521432,'$2b$10$TVkW8d8mJSQKRekByWbhIe2MMBvtMcEHZ4d6HgTtYhgazurdCzrSu','admin'),(34,'admin','23123123','zbyszek@123','Zbyszek','Krawczyk','Grazyna',64444432,'$2a$08$e/62r7GFhx4lQ1zNQGAEHe4lFz7ZYXpu5XhCrW5q3O33uCQsFeW72','admin'),(35,'jan1','21345664535','jan@jan','Janek','Stach','Bogumila',932434444,'$2a$08$C1g7CULxhiD9wkV8G4045e5s5U1rye5uF/jNo0fHYxWtBOeLHtBye','user'),(36,'jań','12321312333','dsad@sadas','dasd','asdas','asdda',123123444,'$2a$08$VfjBISch.4sJFt6wDTSx8OwUeDLeF/j9wdIhPl5gSUQGWLEKoEaUO','user'),(37,'johnsmith89','91032432423','john.smith@example.com','Johnny','Smithet','Johnson',923543554,'$2a$08$hgK8fSShbWHjflkgf66DLeBbNcfMerlc5ENkrAi7vbnvZ.Y1kyY4e','user'),(48,'65346','52433543235','gfxfgf@dfgdgf','dfggdfdfg','jkfghghjfghj','dfgdfghdfghn',864745324,'$2a$08$zYgPCcK99k.ygMgQxc814.2fiT3ub.h7Lbe/Q5yI8MR79EsYMmRte','user'),(55,'Mateusz4444','41354234552','2534543452@dfgdrfsdg','Mateusz','Nowak','KLoc',647233563,'$2a$08$r0k56V9YbfXVcXFS5uF4A.HkQFdqtntPhDdlCDYYgboSBL6Lux0jS','user'),(57,'Tukan22','31231241241','das@dfsasa','sdasda','weqeqw','asdasdasd',532245253,'$2a$08$oiZIMw6HN3s.qQ5814AQAu9okRI9miOEMJ4dYkPeWnFV2kiGtya5q','user'),(70,'Adam','45626642462','Kowal@yu','Adam','Kowal','koala',634633456,'$2a$08$YRHscL7d4m8La32kNV1E3O1/FyVJPrpbbe8Rm/MjyoUe/m/U9kQye','user'),(71,'Julia','72348234762','julia@olele','Julia','Kawka','Wójt',345454512,'$2a$08$QiUZXfXTDzYqmIOzhztYs.h3edHGTvE89PlHUKnHfJEm/S12s7mLS','user');
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (8,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:58:15'),(9,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:58:15'),(10,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:58:15'),(11,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:58:15'),(12,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:58:15'),(13,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:59:42'),(14,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:59:42'),(15,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:59:42'),(16,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:59:42'),(17,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 08:59:42'),(18,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:14:17'),(19,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:14:17'),(20,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:14:17'),(21,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:14:17'),(22,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:14:17'),(23,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:15:44'),(24,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:15:44'),(25,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:15:44'),(26,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:15:44'),(27,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:15:44'),(28,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:15'),(29,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:15'),(30,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:15'),(31,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:15'),(32,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:15'),(33,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:39'),(34,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:39'),(35,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:39'),(36,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:39'),(37,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:17:39'),(38,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:18:25'),(39,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:18:25'),(40,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:18:25'),(41,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:18:25'),(42,35,57,100.00,'7777711416026','7777533335380','Opis','2023-06-11 09:18:25');
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

-- Dump completed on 2023-06-11 11:56:06
