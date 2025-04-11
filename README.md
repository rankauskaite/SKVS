# SKVS 
## Prerequisite
1. Install docker; 
2. Install dbeaver;
3. Install dotnet sdk 8; 

## Setup database
1. In the terminal go to the database directory and enter the command: docker-compose up -d 


1. In dbeaver go to database -> new database connection -> mysql -> next;
     1. In the Main section write:
           * Server Host: localhost;
           * Port: 3306;
           * Database: SKVS;
           * Username: skvs_user;
           * Password: skvs_password;
     2. Go to Driver Properties and set allowPublicKeyRetrieval to true. 
     3. Test connection, it should show connected. 

2. Then go to SQL editor -> new SQL script. Copy paste the script from file: initial_schema.sql and execute sql script(alt+x). 
3. Then go to tables and refresh 
