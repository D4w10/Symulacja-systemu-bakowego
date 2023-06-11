Witaj w projekcie "Sysmulacja systemu bankowego" 

INSTALACJA 
Aby móc uruchomić projekt, postępuj zgofnie z poniższymi krokami

1. Sklonuj repozytorium na swój komputer 

git clone https://github.com/D4w10/Symulacja-systemu-bakowego.git

2. przejdz do katalogu /Bank1 

3. Jeśl iznajdujesz się w katalogu /Bank1 zainstaluj zawartość któą wymaga projetkt poleceniem:

npm install

4. Analogicznei zrób w katalogu KIP

5. Zaimportuj bazę danych
        1.  w katalogu /bank1 znajduję sie plik bank1.sql
        2. Otwórz narzędzie do zarządzanie bazą (np. MySQL Workbench, phpMyAdmin, lub konsola)
            
            Jeśli używasz MYSQL Workbench, postępuj zgodnie z poniższymi krokami:
                *Wybierz zakładkę "Server" i połącz się z Twoim lokalnym serwerem bazy danych.
                *Wybierz zakładkę "Data Import/Restore".
                *Wybierz opcję "Import from Self-Contained File" i wybierz pobrany plik "bank.sql".
                *Wybierz istniejącą bazę lub stóz nową ( najlepiej żeby nazywała sie bank1 ) 
                *Kliknij "Start Import".

            Jeśli korzystasz z phpMyAdmin, postępuj zgodnie z poniższymi krokami:

                *Zaloguj się do phpMyAdmin.
                *Wybierz bazę danych "bank".
                *Kliknij na zakładkę "Import".
                *Wybierz plik "bank.sql" w sekcji "File to import".
                *Kliknij "Go".
            
            Jeśli  korzystasz z terminala
                *zaloguj się do bazy   mysql -u użytkownik -p
                *stwórz nową baze danych   CREATE DATABASE bank1
                *wydz z konsoli msql
                *zaimportuj bazę danych   /sciezka/do/pliku/mysql.exe -t -u użytkownik -p nazwabazy(bank1) < scieżka/do/pliku/bank.sql
        3. Po zaimportowaniu bazy baza danych przejdz dalej

6. Analogicznie musimy zaimportować bazę danych kip, nazywamy ją kip
5. Gdy zaimportowałeś bazę otwórz plik .env który znajduje sie w katalogu bank1
6. W tym pliku ustawiasz nazwę stworzonej przez siebie bazy, użytkownika bazy oraz jego hasło 

7. Po poprawnej instalacji oraz konfiguracji projektu możesz uruchomić poleceniem "npm start"(uruchamiamy serwer KIP i Bank1)

