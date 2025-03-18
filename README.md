# Dziennik Elektroniczny

Projekt zespołowy realizowany w ramach przedmiotu Inżynieria Oprogramowania. Aplikacja webowa do zarządzania ocenami, planem lekcji i użytkownikami w szkole.

## Stack technologiczny
- **Frontend:** Vue.js/Angular
- **Backend:** Spring Boot (Java)
- **Baza danych:** PostgreSQL
- **Narzędzia:** Docker, GitHub Actions

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

## Instrukcja działania w repozytorium

### 1. Przygotowanie środowiska
1. Sklonuj repozytorium:
   ```bash
   git clone <adres-repozytorium>
   cd <nazwa-repozytorium>
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
Wprowadź zmiany w kodzie. Regularnie commituj zmiany z opisowymi komunikatami:
```bash
git add .
git commit -m "Dodano logowanie użytkownika"
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
git commit -m "Przygotowanie do wdrożenia v1.0.0"
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
```
