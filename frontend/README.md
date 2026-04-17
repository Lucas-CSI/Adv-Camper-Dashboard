# HackPath Frontend

React + Tailwind CSS frontend for the HackPath cybersecurity learning platform.

## Setup

```bash
npm install
npm start
```

The app runs on http://localhost:3000 and proxies API calls to your Spring Boot
backend at http://localhost:8080 (configured in `.env`).

## Project structure

```
src/
├── context/
│   └── AuthContext.jsx        # Global auth state, JWT storage
├── services/
│   └── api.js                 # All fetch calls to the backend
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   └── ui/
│       ├── index.jsx          # Spinner, badges, icons, ProgressRing
│       └── QuestionCard.jsx   # Answer submission component
└── pages/
    ├── LandingPage.jsx
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── DashboardPage.jsx
    ├── ModulesPage.jsx
    ├── ModuleDetailPage.jsx
    └── LessonPage.jsx
```

## Pages

| Route              | Auth     | Description                          |
|--------------------|----------|--------------------------------------|
| `/`                | Public   | Landing page                         |
| `/login`           | Public   | Login form                           |
| `/register`        | Public   | Registration form                    |
| `/modules`         | Public   | Browse all modules                   |
| `/modules/:id`     | Public   | Module detail + lesson list          |
| `/dashboard`       | Required | Progress overview                    |
| `/lessons/:id`     | Required | Lesson content + question panel      |

## Backend requirement

Add this to your Spring Boot `application.properties` to allow requests from
the React dev server:

```properties
spring.web.cors.allowed-origins=http://localhost:3000
```

Or configure a `CorsConfig` bean:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Extending

- **Add a `/api/lessons/{id}` endpoint** on the backend to avoid the current
  workaround of fetching lessons via their parent module.
- **Leaderboard page** — call `GET /api/leaderboard` and render a ranked list.
- **Admin panel** — add create/edit forms for modules and lessons, gated by
  `ROLE_ADMIN` via `<ProtectedRoute adminOnly />`.
