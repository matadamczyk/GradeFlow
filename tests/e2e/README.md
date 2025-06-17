# Testy End-to-End (E2E) - GradeFlow

Ten folder zawiera testy end-to-end napisane w Playwright dla aplikacji GradeFlow.

## 🚀 Uruchamianie testów

### Podstawowe komendy

```bash
# Uruchom wszystkie testy e2e
nx e2e client-e2e

# Uruchom testy w trybie headless (bez okna przeglądarki)
nx e2e-ci client-e2e

# Uruchom testy w trybie headed (z widocznym oknem przeglądarki)
nx e2e client-e2e --headed

# Uruchom konkretny plik testowy
nx e2e client-e2e --spec=src/auth.spec.ts

# Uruchom testy na konkretnej przeglądarce
nx e2e client-e2e --project=chromium
nx e2e client-e2e --project=firefox
nx e2e client-e2e --project=webkit
```

### Generowanie i wyświetlanie raportów

```bash
# Wygeneruj raport HTML
nx e2e client-e2e --reporter=html

# Wyświetl ostatni raport
nx show-report client-e2e
```

### Debugging testów

```bash
# Uruchom testy w trybie debug
nx e2e client-e2e --debug

# Uruchom z Playwright Inspector
nx e2e client-e2e --ui
```

## 📁 Struktura plików

```
tests/e2e/
├── src/
│   ├── example.spec.ts      # Podstawowe testy aplikacji
│   ├── auth.spec.ts         # Testy autoryzacji i logowania
│   └── navigation.spec.ts   # Testy nawigacji
├── playwright.config.ts     # Konfiguracja Playwright
├── project.json            # Konfiguracja projektu Nx
├── tsconfig.json           # Konfiguracja TypeScript
└── README.md              # Ten plik
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

- `BASE_URL` - URL aplikacji (domyślnie: http://localhost:4200)
- `CI` - Tryb CI (automatycznie wykrywany)

### Przeglądarki

Testy są skonfigurowane do uruchamiania na:
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox (Desktop Firefox) 
- ✅ WebKit (Desktop Safari)

## 📝 Pisanie testów

### Dobre praktyki

1. **Używaj data-testid dla selektorów**:
   ```typescript
   await page.click('[data-testid="login-button"]');
   ```

2. **Grupuj testy w describe blocks**:
   ```typescript
   test.describe('Funkcjonalność logowania', () => {
     // testy związane z logowaniem
   });
   ```

3. **Używaj beforeEach dla setup**:
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/');
   });
   ```

4. **Sprawdzaj stan asynchronicznie**:
   ```typescript
   await expect(page.locator('h1')).toBeVisible();
   ```

### Przykład testu

```typescript
import { test, expect } from '@playwright/test';

test.describe('Przykładowa funkcjonalność', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('powinien wykonywać jakąś akcję', async ({ page }) => {
    // Arrange - przygotuj dane testowe
    
    // Act - wykonaj akcję
    await page.click('[data-testid="example-button"]');
    
    // Assert - sprawdź wynik
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

## 🐛 Rozwiązywanie problemów

### Częste problemy

1. **Test nie może znaleźć elementu**:
   - Sprawdź czy selektor jest prawidłowy
   - Dodaj oczekiwanie na element: `await page.waitForSelector('[data-testid="element"]')`

2. **Timeout podczas ładowania strony**:
   - Zwiększ timeout w konfiguracji
   - Sprawdź czy aplikacja jest uruchomiona

3. **Testy działają lokalnie ale nie na CI**:
   - Sprawdź czy wszystkie zależności są zainstalowane
   - Użyj trybu headless: `--headed=false`

### Debugowanie

1. **Screenshot on failure** (już skonfigurowane):
   ```typescript
   // Zrzuty ekranu są automatycznie zapisywane przy błędach
   ```

2. **Video recording**:
   ```typescript
   // Nagrania są włączone w konfiguracji
   ```

3. **Console logs**:
   ```typescript
   page.on('console', msg => console.log(msg.text()));
   ```

## 📚 Przydatne linki

- [Dokumentacja Playwright](https://playwright.dev/docs/intro)
- [Dokumentacja Nx Playwright](https://nx.dev/recipes/playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Selektory w Playwright](https://playwright.dev/docs/selectors)

## 🤝 Wkład w rozwój

1. Dodaj nowe testy w katalogu `src/`
2. Używaj opisowych nazw testów w języku polskim
3. Dodaj komentarze wyjaśniające złożone interakcje
4. Aktualizuj ten README przy dodawaniu nowych funkcjonalności 