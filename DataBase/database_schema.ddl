-- DDL Statements

CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Driver` (
  `user_id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Driver_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Guard` (
  `user_id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Guard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `TruckingCompanyManager` (
  `user_id` int NOT NULL,
  `TruckingCompanyName` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `TruckingCompanyManager_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Vehicle` (
  `plateNumber` varchar(20) NOT NULL,
  PRIMARY KEY (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Truck` (
  `plateNumber` varchar(20) NOT NULL,
  `loadingCapacity` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `Truck_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`),
  CONSTRAINT `Truck_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `TruckingCompanyManager` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkerCar` (
  `plateNumber` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  CONSTRAINT `WorkerCar_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `GuestCar` (
  `plateNumber` varchar(20) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `permissionUntil` date DEFAULT NULL,
  PRIMARY KEY (`plateNumber`),
  CONSTRAINT `GuestCar_ibfk_1` FOREIGN KEY (`plateNumber`) REFERENCES `Vehicle` (`plateNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `SVS` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `TransportationOrder` (
  `orderID` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `address` varchar(255) DEFAULT NULL,
  `isCancelled` tinyint(1) DEFAULT '0',
  `deliveryTime` datetime DEFAULT NULL,
  `ramp` int DEFAULT NULL,
  `isCompleted` tinyint(1) DEFAULT '0',
  `assignedDriverId` int DEFAULT NULL,
  `state` enum('Cancelled','Scheduled','Formed','InProgress','Completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isOnTheWay` tinyint(1) DEFAULT '0',
  `createdBy_id` int DEFAULT NULL,
  `deliveryTimeId` int DEFAULT NULL,
  `truckPlateNumber` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`orderID`),
  KEY `createdBy_id` (`createdBy_id`),
  KEY `truckPlateNumber` (`truckPlateNumber`),
  CONSTRAINT `TransportationOrder_ibfk_1` FOREIGN KEY (`createdBy_id`) REFERENCES `TruckingCompanyManager` (`user_id`),
  CONSTRAINT `TransportationOrder_ibfk_2` FOREIGN KEY (`truckPlateNumber`) REFERENCES `Truck` (`plateNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WarehouseOrder` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderID` int DEFAULT NULL,
  `count` int DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `deliveryDate` date DEFAULT NULL,
  `transportationOrderID` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `truckingCompanyUserId` int DEFAULT NULL,
  `weight` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transportationOrderID` (`transportationOrderID`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `WarehouseOrder_ibfk_1` FOREIGN KEY (`transportationOrderID`) REFERENCES `TransportationOrder` (`orderID`),
  CONSTRAINT `WarehouseOrder_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `SVS` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `NumberPlateRecognitionSystem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lastScannedNumber` varchar(20) DEFAULT NULL,
  `arPrivažaves` tinyint(1) DEFAULT '0',
  `guard_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guard_id` (`guard_id`),
  CONSTRAINT `NumberPlateRecognitionSystem_ibfk_1` FOREIGN KEY (`guard_id`) REFERENCES `Guard` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;