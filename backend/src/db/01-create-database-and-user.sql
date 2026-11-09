   USE master;
   CREATE LOGIN tugas2_user WITH PASSWORD = 'GANTI_PASSWORD_KAMU';
   USE review_kantin;
   CREATE USER tugas2_user FOR LOGIN tugas2_user;
   ALTER ROLE db_datareader ADD MEMBER tugas2_user;
   ALTER ROLE db_datawriter ADD MEMBER tugas2_user;