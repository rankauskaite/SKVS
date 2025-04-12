USE SKVS;

-- 1. User su ID kaip PRIMARY KEY
CREATE TABLE User (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phoneNumber VARCHAR(20)
);

-- 2. Driver (paveldi iš User)
CREATE TABLE Driver (
    user_id INT PRIMARY KEY,
    name VARCHAR(50),
    surname VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- 3. Guard
CREATE TABLE Guard (
    user_id INT PRIMARY KEY,
    name VARCHAR(50),
    surname VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- 4. TruckingCompanyManager
CREATE TABLE TruckingCompanyManager (
    user_id INT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

-- 5. Message (jungiasi su Driver ir Manager)
CREATE TABLE Message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    text TEXT,
    isSent BOOLEAN DEFAULT FALSE,
    isInLine BOOLEAN DEFAULT FALSE,
    messageTransmissionTime DATETIME,
    driver_id INT,
    manager_id INT,
    FOREIGN KEY (driver_id) REFERENCES Driver(user_id),
    FOREIGN KEY (manager_id) REFERENCES TruckingCompanyManager(user_id)
);

-- 6. Number Plate Recognition System
CREATE TABLE NumberPlateRecognitionSystem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lastScannedNumber VARCHAR(20),
    arPrivažaves BOOLEAN DEFAULT FALSE,
    guard_id INT,
    FOREIGN KEY (guard_id) REFERENCES Guard(user_id)
);

-- 7. Vehicle
CREATE TABLE Vehicle (
    plateNumber VARCHAR(20) PRIMARY KEY
);

-- 8. Truck (priklauso Manageriui)
CREATE TABLE Truck (
    plateNumber VARCHAR(20) PRIMARY KEY,
    loadingCapacity INT,
    owner_id INT,
    FOREIGN KEY (plateNumber) REFERENCES Vehicle(plateNumber),
    FOREIGN KEY (owner_id) REFERENCES TruckingCompanyManager(user_id)
);

-- 9. WorkerCar
CREATE TABLE WorkerCar (
    plateNumber VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    surname VARCHAR(50),
    FOREIGN KEY (plateNumber) REFERENCES Vehicle(plateNumber)
);

-- 10. GuestCar
CREATE TABLE GuestCar (
    plateNumber VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    surname VARCHAR(50),
    permissionUntil DATE,
    FOREIGN KEY (plateNumber) REFERENCES Vehicle(plateNumber)
);

-- 11. TransportationOrder (su ENUM)
CREATE TABLE TransportationOrder (
    orderID INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT,
    address VARCHAR(255),
    isCancelled BOOLEAN DEFAULT FALSE,
    deliveryTime DATE,
    ramp INT,
    isCompleted BOOLEAN DEFAULT FALSE, 
    assignedDriverId INT,
    state ENUM('Cancelled', 'Formed', 'InProgress', 'Completed'),
    isOnTheWay BOOLEAN DEFAULT FALSE,
    createdBy_id INT, 
    deliveryTimeId INT,
    truckPlateNumber VARCHAR(20),
    FOREIGN KEY (createdBy_id) REFERENCES TruckingCompanyManager(user_id),
    FOREIGN KEY (truckPlateNumber) REFERENCES Truck(plateNumber)
);

-- 12. WarehouseOrder
CREATE TABLE WarehouseOrder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    orderID INT,
    count INT,
    orderDate DATE,
    deliveryDate DATE,
    transportationOrderID INT,
    FOREIGN KEY (transportationOrderID) REFERENCES TransportationOrder(orderID)
);

-- 13. SVS
CREATE TABLE SVS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)
);

ALTER TABLE WarehouseOrder
ADD COLUMN client_id INT,
ADD FOREIGN KEY (client_id) REFERENCES SVS(id);

-- 14. AvailableDeliveryTime
CREATE TABLE AvailableDeliveryTime (
    id INT PRIMARY KEY AUTO_INCREMENT,
    time INT,
    ramp INT,
    date DATE,
    svs_id INT,
    FOREIGN KEY (svs_id) REFERENCES SVS(id)
);
