-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: SKVS
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AvailableDeliveryTime`
--

DROP TABLE IF EXISTS `AvailableDeliveryTime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AvailableDeliveryTime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` int DEFAULT NULL,
  `ramp` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `svs_id` int DEFAULT NULL,
  `isTaken` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `svs_id` (`svs_id`),
  CONSTRAINT `AvailableDeliveryTime_ibfk_1` FOREIGN KEY (`svs_id`) REFERENCES `SVS` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AvailableDeliveryTime`
--

LOCK TABLES `AvailableDeliveryTime` WRITE;
/*!40000 ALTER TABLE `AvailableDeliveryTime` DISABLE KEYS */;
INSERT INTO `AvailableDeliveryTime` VALUES (1,540,2,'2025-04-15 09:00:00',1,0),(2,540,3,'2025-04-15 09:00:00',1,1),(3,600,2,'2025-04-15 10:00:00',1,0),(4,540,3,'2025-04-18 09:00:00',1,0);
/*!40000 ALTER TABLE `AvailableDeliveryTime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Driver`
--

DROP TABLE IF EXISTS `Driver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Driver` (
  `user_id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Driver_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Driver`
--

LOCK TABLES `Driver` WRITE;
/*!40000 ALTER TABLE `Driver` DISABLE KEYS */;
INSERT INTO `Driver` VALUES (1,'Jonas','Jonaitis'),(2,'Antanas','Antanaitis');
/*!40000 ALTER TABLE `Driver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Guard`
--

DROP TABLE IF EXISTS `Guard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Guard` (
  `user_id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Guard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Guard`
--

LOCK TABLES `Guard` WRITE;
/*!40000 ALTER TABLE `Guard` DISABLE KEYS */;
INSERT INTO `Guard` VALUES (2,'Petras','Petraitis');
/*!40000 ALTER TABLE `Guard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GuestCar`
--

DROP TABLE IF EXISTS `GuestCar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GuestCar` (
  `plateNumber` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `permissionUntil` date DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  CONSTRAINT `GuestCar_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GuestCar`
--

LOCK TABLES `GuestCar` WRITE;
/*!40000 ALTER TABLE `GuestCar` DISABLE KEYS */;
INSERT INTO `GuestCar` VALUES ('GST999','Vardenis','Pavardenis','2025-12-31');
/*!40000 ALTER TABLE `GuestCar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text,
  `isSent` tinyint(1) DEFAULT '0',
  `isInLine` tinyint(1) DEFAULT '0',
  `messageTransmissionTime` datetime DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_id` (`driver_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `Message_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `Driver` (`user_id`),
  CONSTRAINT `Message_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `TruckingCompanyManager` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES (1,'Atvykimas numatytas 15:00',1,0,'2025-04-12 14:06:26',1,3);
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NumberPlateRecognitionSystem`
--

DROP TABLE IF EXISTS `NumberPlateRecognitionSystem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NumberPlateRecognitionSystem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lastScannedNumber` varchar(20) DEFAULT NULL,
  `arPrivažaves` tinyint(1) DEFAULT '0',
  `guard_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guard_id` (`guard_id`),
  CONSTRAINT `NumberPlateRecognitionSystem_ibfk_1` FOREIGN KEY (`guard_id`) REFERENCES `Guard` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NumberPlateRecognitionSystem`
--

LOCK TABLES `NumberPlateRecognitionSystem` WRITE;
/*!40000 ALTER TABLE `NumberPlateRecognitionSystem` DISABLE KEYS */;
/*!40000 ALTER TABLE `NumberPlateRecognitionSystem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SVS`
--

DROP TABLE IF EXISTS `SVS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SVS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SVS`
--

LOCK TABLES `SVS` WRITE;
/*!40000 ALTER TABLE `SVS` DISABLE KEYS */;
INSERT INTO `SVS` VALUES (1,'SVS SANDĖLIS');
/*!40000 ALTER TABLE `SVS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransportationOrder`
--

DROP TABLE IF EXISTS `TransportationOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TransportationOrder` (
  `orderID` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `address` varchar(255) DEFAULT NULL,
  `isCancelled` tinyint(1) DEFAULT '0',
  `deliveryTime` datetime DEFAULT NULL,
  `ramp` int DEFAULT NULL,
  `isCompleted` tinyint(1) DEFAULT '0',
  `assignedDriverId` int DEFAULT NULL,
  `state` enum('Cancelled','Formed','InProgress','Completed') DEFAULT NULL,
  `isOnTheWay` tinyint(1) DEFAULT '0',
  `createdBy_id` int DEFAULT NULL,
  `deliveryTimeId` int DEFAULT NULL,
  `truckPlateNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`orderID`),
  KEY `createdBy_id` (`createdBy_id`),
  KEY `truckPlateNumber` (`truckPlateNumber`),
  CONSTRAINT `TransportationOrder_ibfk_1` FOREIGN KEY (`createdBy_id`) REFERENCES `TruckingCompanyManager` (`user_id`),
  CONSTRAINT `TransportationOrder_ibfk_2` FOREIGN KEY (`truckPlateNumber`) REFERENCES `Truck` (`plateNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransportationOrder`
--

LOCK TABLES `TransportationOrder` WRITE;
/*!40000 ALTER TABLE `TransportationOrder` DISABLE KEYS */;
INSERT INTO `TransportationOrder` VALUES (1001,'Statybinių medžiagų pervežimas','Vilnius, Sandėlių g. 5',0,'2025-04-15 09:00:00',3,0,1,'Formed',1,3,2,'TRK123'),(1002,'Aprasymas','adresas',0,'2025-04-18 00:00:00',NULL,0,1,'Formed',0,3,NULL,'TRK123');
/*!40000 ALTER TABLE `TransportationOrder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Truck`
--

DROP TABLE IF EXISTS `Truck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Truck` (
  `plateNumber` varchar(20) NOT NULL,
  `loadingCapacity` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `Truck_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`),
  CONSTRAINT `Truck_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `TruckingCompanyManager` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Truck`
--

LOCK TABLES `Truck` WRITE;
/*!40000 ALTER TABLE `Truck` DISABLE KEYS */;
INSERT INTO `Truck` VALUES ('TRK123',15000,3);
/*!40000 ALTER TABLE `Truck` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TruckingCompanyManager`
--

DROP TABLE IF EXISTS `TruckingCompanyManager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TruckingCompanyManager` (
  `user_id` int NOT NULL,
  `TruckingCompanyName` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `TruckingCompanyManager_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TruckingCompanyManager`
--

LOCK TABLES `TruckingCompanyManager` WRITE;
/*!40000 ALTER TABLE `TruckingCompanyManager` DISABLE KEYS */;
INSERT INTO `TruckingCompanyManager` VALUES (3,'Sunkv. imone');
/*!40000 ALTER TABLE `TruckingCompanyManager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'driver01','pass123','+37061234567'),(2,'guard01','pass456','+37061111111'),(3,'manager01','pass789','+37067777777');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vehicle`
--

DROP TABLE IF EXISTS `Vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Vehicle` (
  `plateNumber` varchar(20) NOT NULL,
  PRIMARY KEY (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vehicle`
--

LOCK TABLES `Vehicle` WRITE;
/*!40000 ALTER TABLE `Vehicle` DISABLE KEYS */;
INSERT INTO `Vehicle` VALUES ('GST999'),('TRK123'),('WRK001');
/*!40000 ALTER TABLE `Vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WarehouseOrder`
--

DROP TABLE IF EXISTS `WarehouseOrder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WarehouseOrder` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderID` int DEFAULT NULL,
  `count` int DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `deliveryDate` date DEFAULT NULL,
  `transportationOrderID` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `truckingCompanyUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transportationOrderID` (`transportationOrderID`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `WarehouseOrder_ibfk_1` FOREIGN KEY (`transportationOrderID`) REFERENCES `TransportationOrder` (`orderID`),
  CONSTRAINT `WarehouseOrder_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `SVS` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WarehouseOrder`
--

LOCK TABLES `WarehouseOrder` WRITE;
/*!40000 ALTER TABLE `WarehouseOrder` DISABLE KEYS */;
INSERT INTO `WarehouseOrder` VALUES (1,5001,120,'2025-04-10','2025-04-15',1001,1,3),(2,3,1,'2025-04-12','2025-04-17',1002,1,3),(3,7,1,'2025-04-12','2025-04-17',NULL,1,NULL);
/*!40000 ALTER TABLE `WarehouseOrder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WorkerCar`
--

DROP TABLE IF EXISTS `WorkerCar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkerCar` (
  `plateNumber` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  CONSTRAINT `WorkerCar_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WorkerCar`
--

LOCK TABLES `WorkerCar` WRITE;
/*!40000 ALTER TABLE `WorkerCar` DISABLE KEYS */;
INSERT INTO `WorkerCar` VALUES ('WRK001','Tomas','Darbininkas');
/*!40000 ALTER TABLE `WorkerCar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'SKVS'
--

--
-- Dumping routines for database 'SKVS'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-13 16:12:59
