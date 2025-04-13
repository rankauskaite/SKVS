USE SKVS;
-- 1. Users
INSERT INTO User (username, password, phoneNumber) VALUES
('driver01', 'pass123', '+37061234567'),
('guard01', 'pass456', '+37061111111'),
('manager01', 'pass789', '+37067777777');

-- 2. Driver
INSERT INTO Driver (user_id, name, surname)
SELECT id, 'Jonas', 'Jonaitis' FROM User WHERE username = 'driver01';

-- 3. Guard
INSERT INTO Guard (user_id, name, surname)
SELECT id, 'Petras', 'Petraitis' FROM User WHERE username = 'guard01';

-- 4. TruckingCompanyManager
INSERT INTO TruckingCompanyManager (user_id)
SELECT id FROM User WHERE username = 'manager01';

-- 5. Vehicles
INSERT INTO Vehicle (plateNumber) VALUES
('TRK123'), ('WRK001'), ('GST999');

-- 6. Truck
INSERT INTO Truck (plateNumber, loadingCapacity, owner_id)
SELECT 'TRK123', 15000,
    (SELECT user_id FROM TruckingCompanyManager LIMIT 1);

-- 7. WorkerCar
INSERT INTO WorkerCar (plateNumber, name, surname)
VALUES ('WRK001', 'Tomas', 'Darbininkas');

-- 8. GuestCar
INSERT INTO GuestCar (plateNumber, name, surname, permissionUntil)
VALUES ('GST999', 'Vardenis', 'Pavardenis', '2025-12-31');

-- 9. TransportationOrder
INSERT INTO TransportationOrder (orderID, description, address, isCancelled, deliveryTime, ramp, isCompleted, state, isOnTheWay, createdBy_id, truckPlateNumber)
VALUES (1001, 'Statybinių medžiagų pervežimas', 'Vilnius, Sandėlių g. 5', FALSE, '2025-04-15', 2, FALSE, 'Formed', TRUE,
    (SELECT user_id FROM TruckingCompanyManager LIMIT 1), 'TRK123');

-- 10. WarehouseOrder
INSERT INTO WarehouseOrder (orderID, count, orderDate, deliveryDate, transportationOrderID)
VALUES (5001, 120, '2025-04-10', '2025-04-15', 1001);

-- 11. SVS
INSERT INTO SVS (name) VALUES ('SVS SANDĖLIS');

-- Susiejame SVS su WarehouseOrder
UPDATE WarehouseOrder
SET client_id = (SELECT id FROM SVS WHERE name = 'SVS SANDĖLIS')
WHERE orderID = 5001;

-- 12. AvailableDeliveryTime
INSERT INTO AvailableDeliveryTime (time, ramp, date, svs_id)
VALUES (10, 2, '2025-04-15', (SELECT id FROM SVS WHERE name = 'SVS SANDĖLIS'));

-- 13. Message (nuo vadybininko vairuotojui)
INSERT INTO Message (text, isSent, isInLine, messageTransmissionTime, driver_id, manager_id)
VALUES ('Atvykimas numatytas 15:00', TRUE, FALSE, NOW(),
    (SELECT user_id FROM Driver WHERE user_id IS NOT NULL LIMIT 1),
    (SELECT user_id FROM TruckingCompanyManager LIMIT 1));

--- 14. Įmonės pavadinimo pridėjimas
ALTER TABLE TruckingCompanyManager
ADD TruckingCompanyName VARCHAR(255);

UPDATE TruckingCompanyManager
SET TruckingCompanyName = 'Baltic Transline'
WHERE user_id = (SELECT id FROM User WHERE username = 'manager01');

--- 15. Pervežimo įmonės pridėjimas prie užsakymo
ALTER TABLE WarehouseOrder
ADD truckingCompanyUserId INT NULL,
ADD CONSTRAINT FK_WarehouseOrder_TruckingCompany FOREIGN KEY (truckingCompanyUserId)
REFERENCES TruckingCompanyManager(user_id)
ON DELETE SET NULL;

--- 16. Naujo manager User pridėjimas
INSERT INTO User (username, password, phoneNumber) 
VALUES ('manager02', 'pass321', '+37069876543');

--- 17. Naujo TruckingCompanyManager pridėjimas
INSERT INTO TruckingCompanyManager (user_id, TruckingCompanyName)
SELECT id, 'Rosteka' FROM User WHERE username = 'manager02';