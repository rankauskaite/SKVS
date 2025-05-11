-- DML Statements

-- Data for table `User`
INSERT INTO `User` (`id`, `username`, `password`, `phoneNumber`) VALUES
(1, 'driver01', 'pass123', '+37061234567'),
(2, 'guard01', 'pass456', '+37061111111'),
(3, 'manager01', 'pass789', '+37067777777');

-- Data for table `Driver`
INSERT INTO `Driver` (`user_id`, `name`, `surname`) VALUES
(1, 'Jonas', 'Jonaitis'),
(2, 'Antanas', 'Antanaitis');

-- Data for table `Guard`
INSERT INTO `Guard` (`user_id`, `name`, `surname`) VALUES
(2, 'Petras', 'Petraitis');

-- Data for table `TruckingCompanyManager`
INSERT INTO `TruckingCompanyManager` (`user_id`, `TruckingCompanyName`) VALUES
(3, 'Sunkv. imone');

-- Data for table `Vehicle`
INSERT INTO `Vehicle` (`plateNumber`) VALUES
('GST999'),
('TRK123'),
('WRK001');

-- Data for table `Truck`
INSERT INTO `Truck` (`plateNumber`, `loadingCapacity`, `owner_id`) VALUES
('TRK123', 15000, 3);

-- Data for table `WorkerCar`
INSERT INTO `WorkerCar` (`plateNumber`, `name`, `surname`) VALUES
('WRK001', 'Tomas', 'Darbininkas');

-- Data for table `GuestCar`
INSERT INTO `GuestCar` (`plateNumber`, `name`, `surname`, `permissionUntil`) VALUES
('GST999', 'Vardenis', 'Pavardenis', '2025-12-31');

-- Data for table `SVS`
INSERT INTO `SVS` (`id`, `name`) VALUES
(1, 'SVS SANDĖLIS');

-- Data for table `AvailableDeliveryTime`
INSERT INTO `AvailableDeliveryTime` (`id`, `time`, `ramp`, `date`, `svs_id`, `isTaken`) VALUES
(1, 540, 2, '2025-04-15 09:00:00', 1, 0),
(2, 540, 3, '2025-04-15 09:00:00', 1, 1),
(3, 600, 2, '2025-04-15 10:00:00', 1, 0),
(4, 540, 3, '2025-04-18 09:00:00', 1, 0);

-- Data for table `TransportationOrder`
INSERT INTO `TransportationOrder` (`orderID`, `description`, `address`, `isCancelled`, `deliveryTime`, `ramp`, `isCompleted`, `assignedDriverId`, `state`, `isOnTheWay`, `createdBy_id`, `deliveryTimeId`, `truckPlateNumber`) VALUES
(1001, 'Statybinių medžiagų pervežimas', 'Vilnius, Sandėlių g. 5', 0, '2025-04-15 09:00:00', 3, 0, 1, 'Scheduled', 1, 3, 2, 'TRK123'),
(1002, 'Aprasymas', 'adresas', 0, '2025-04-18 00:00:00', NULL, 0, 1, 'Formed', 0, 3, NULL, 'TRK123'),
(1003, 'trali vali', 'Kauno g. 9', 0, '2025-04-22 00:00:00', NULL, 0, 2, 'Formed', 0, 3, NULL, 'TRK123'),
(1010, 'bandau', 'Gatve g. 5', 0, '2025-04-16 00:00:00', NULL, 0, 1, 'Formed', 0, 3, NULL, 'TRK123');

-- Data for table `WarehouseOrder`
INSERT INTO `WarehouseOrder` (`id`, `orderID`, `count`, `orderDate`, `deliveryDate`, `transportationOrderID`, `client_id`, `truckingCompanyUserId`, `weight`) VALUES
(1, 5001, 120, '2025-04-10', '2025-04-15', 1001, 1, 3, 50),
(2, 3, 1, '2025-04-12', '2025-04-17', 1002, 1, 3, 50),
(3, 7, 1, '2025-04-12', '2025-04-17', 1003, 1, 3, 50),
(4, 12, 1, '2025-04-13', '2025-04-22', 1010, 1, 3, 50),
(5, 32, 1, '2025-04-13', '2025-04-15', NULL, 1, NULL, 50),
(8, 80, 1, '2025-04-21', '2025-04-22', NULL, 1, NULL, 0),
(9, 126, 1, '2025-04-17', '2025-04-25', NULL, 1, NULL, 380),
(12, 11, 1, '2025-04-16', '2025-04-25', NULL, 1, NULL, 100);

-- Data for table `Message`
INSERT INTO `Message` (`id`, `text`, `isSent`, `isInLine`, `messageTransmissionTime`, `driver_id`, `manager_id`) VALUES
(1, 'Atvykimas numatytas 15:00', 1, 0, '2025-04-12 14:06:26', 1, 3);

-- Data for table `NumberPlateRecognitionSystem`
-- (No data to insert)