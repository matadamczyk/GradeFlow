# Dziennik Elektroniczny "GradeFlow"

Projekt zespołowy realizowany w ramach przedmiotu Inżynieria Oprogramowania. Aplikacja webowa do zarządzania ocenami, planem lekcji i użytkownikami w szkole.

## O projekcie

Dziennik Elektroniczny to kompleksowa aplikacja webowa zaprojektowana do zarządzania wszystkimi aspektami funkcjonowania szkoły, w tym:
- zarządzanie ocenami i wynikami uczniów
- prowadzenie elektronicznej dokumentacji szkolnej
- zarządzanie planem lekcji
- komunikacja między nauczycielami, uczniami i rodzicami
- generowanie raportów i statystyk

## Stack technologiczny
- **Frontend:** Angular
- **Backend:** Spring Boot (Java 21)
- **Baza danych:** PostgreSQL
- **Testy:**
  - Jednostkowe: JUnit
  - Integracyjne: Angular + JUnit
  - E2E: Playwright
- **Narzędzia:** Docker, GitHub Actions, Render (deployment)

## Wymagania systemowe
- Node.js (wersja 16 lub wyższa)
- Java 21
- Docker i Docker Compose
- PostgreSQL 13 lub wyższy
- Maven 3.6.3 lub wyższy

## Struktura branchy
W projekcie używamy dwóch głównych branchy oraz branchy funkcyjnych:

1. **`main`:**
   - Główna gałąź zawierająca stabilny i gotowy do wdrożenia kod.
   - Tylko osoba odpowiedzialna za wdrożenia może mergować do `main`.

2. **`develop`:**
   - Gałąź, w której integruje się aktualnie rozwijany kod.
   - Wszystkie nowe funkcjonalności są mergowane do `develop` po zatwierdzeniu przez code review.

3. **Branch funkcyjne (feature branches):**
   - Tworzone z `develop` do implementacji poszczególnych funkcjonalności.
   - Nazwy branchy powinny być opisowe, np. `feature/user-authentication`, `feature/grades-management`.
   - Po zakończeniu pracy nad funkcjonalnością tworzony jest **merge request (MR)** do `develop`.

## Konwencja commitów

W tym projekcie używamy standardu [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) do formatowania wiadomości commitów.

### Format wiadomości commit
```
<typ>[opcjonalny zakres]: <opis>

[opcjonalne ciało]

[opcjonalne stopki]
```

### Typy commitów
- **feat**: nowa funkcjonalność (koreluje z MINOR w wersjonowaniu semantycznym)
- **fix**: poprawka błędu (koreluje z PATCH w wersjonowaniu semantycznym)
- **docs**: zmiany w dokumentacji
- **style**: zmiany formatowania, które nie wpływają na kod (białe znaki, formatowanie, brakujące średniki itp.)
- **refactor**: refaktoryzacja kodu produkcyjnego
- **test**: dodawanie testów, refaktoryzacja testów
- **chore**: aktualizacja zadań rutynowych, zarządzanie paczkami
- **build**: zmiany wpływające na system budowania lub zależności zewnętrzne
- **ci**: zmiany w konfiguracji CI/CD i skryptach

### Przykłady

```
feat(auth): dodanie logowania przez Google

fix(grades): naprawienie błędu w obliczaniu średniej

docs: aktualizacja dokumentacji API

feat(ui)!: przeprojektowanie interfejsu użytkownika

BREAKING CHANGE: zmiana wymaga zaktualizowania zależności klienta
```

### Breaking Changes
Breaking changes (zmiany łamiące kompatybilność) powinny być oznaczone wykrzyknikiem po typie/zakresie lub uwzględnione w sekcji stopki jako `BREAKING CHANGE:`.

## Uruchomienie projektu

### 1. Przygotowanie środowiska
1. Sklonuj repozytorium:
   ```bash
```bash
git clone https://github.com/matadamczyk/GradeFlow
cd GradeFlow
```
   ```
2. Przełącz się na branch develop:
   ```bash
   git checkout develop
   ```

### 2. Tworzenie nowego brancha funkcyjnego
Przełącz się na branch develop i pobierz najnowsze zmiany:
```bash
git checkout develop
git pull origin develop
```
Utwórz nowy branch funkcyjny:
```bash
git checkout -b feature/nazwa-funkcjonalnosci
```
Przykład:
```bash
git checkout -b feature/user-authentication
```

### 3. Praca na branchu funkcyjnym
Wprowadź zmiany w kodzie. Regularnie commituj zmiany zgodnie z konwencją Conventional Commits:
```bash
git add .
git commit -m "feat(auth): dodano logowanie użytkownika"
```
Wypychaj zmiany do zdalnego repozytorium:
```bash
git push origin feature/nazwa-funkcjonalnosci
```

### 4. Tworzenie merge requestu (MR) do develop
Przejdź do repozytorium na GitHub/GitLab. Utwórz nowy merge request z brancha funkcyjnego do develop. Opisz zmiany w MR (np. co zostało zrobione, jakie problemy rozwiązano). Przypisz osobę do code review (np. innego członka zespołu). Po zatwierdzeniu MR przez code review, wykonaj merge do develop.

### 5. Aktualizacja brancha develop
Po zmergowaniu MR do develop, pobierz najnowsze zmiany:
```bash
git checkout develop
git pull origin develop
```

### 6. Przygotowanie do wdrożenia na main
Gdy kod w develop jest stabilny i gotowy do wdrożenia, utwórz release branch (opcjonalnie):
```bash
git checkout -b release/v1.0.0
```
Wprowadź ewentualne poprawki (np. poprawki błędów, aktualizacje wersji). Utwórz merge request z release/v1.0.0 do main.

### 7. Merge do main
Tylko osoba odpowiedzialna za wdrożenia może mergować do main. Po zmergowaniu, utwórz tag dla nowej wersji:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 8. Aktualizacja develop po wdrożeniu
Po zmergowaniu do main, zmerguj zmiany z powrotem do develop:
```bash
git checkout develop
git merge main
git push origin develop
```

## Przepływ pracy (Git Flow)
Nowa funkcjonalność:
```bash
git checkout develop
git checkout -b feature/nazwa-funkcjonalnosci
# Praca na branchu funkcyjnym.
git push origin feature/nazwa-funkcjonalnosci
# Utwórz MR do develop.
```
Przygotowanie do wdrożenia:
```bash
git checkout develop
git checkout -b release/v1.0.0
# Wprowadź poprawki.
git add .
git commit -m "chore(release): przygotowanie do wdrożenia v1.0.0"
git push origin release/v1.0.0
# Przejdź do GitHub/GitLab.
# Utwórz MR z release/v1.0.0 do main.
```
Zatwierdź i zmerguj MR.

### Tworzenie tagu:
```bash
git checkout main
git tag v1.0.0
git push origin v1.0.0
```

### Aktualizacja develop:
```bash
git checkout develop
git merge main
git push origin develop
```

## Uruchomienie projektu

### Wymagania wstępne
- Node.js (wersja 16 lub wyższa)
- Java 17 lub wyższa
- Docker i Docker Compose
- PostgreSQL 13 lub wyższy

### Uruchomienie środowiska deweloperskiego
1. Uruchom bazę danych PostgreSQL:
   ```bash
   docker-compose up -d
   ```

2. Uruchomienie backendu
```bash
cd apps/server
mvn spring-boot:run
```

3. Uruchomienie frontendu
```bash
cd apps/client
npm install
npm start
```

4. Aplikacja będzie dostępna pod adresem http://localhost:4200

## Testowanie

### Testy jednostkowe backend
```bash
cd apps/server
mvn test
```

### Testy jednostkowe frontend
```bash
cd apps/client
npm test
```

### Testy E2E
```bash
cd apps/client
npm run e2e
```

## Wdrażanie
Aplikacja jest wdrażana automatycznie na platformie Render po zmergowaniu do brancha `main` za pomocą GitHub Actions.

```
