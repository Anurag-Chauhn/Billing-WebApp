# Fixes applied

Every change is marked with a `// FIX:` comment in the source.

| # | File | Problem | Change |
|---|------|---------|--------|
| 1 | `service/AppUserDetailsService.java` | `SimpleGrantedAuthority("ADMIN")` never matched `hasRole("ADMIN")`, which needs `ROLE_ADMIN` → 403 on every `/admin/**` call | Prefix `ROLE_` when absent; throw `UsernameNotFoundException` instead of `RuntimeException` |
| 2 | `config/AWSConfig.java` | `@Value("$aws.secret.kry")` — no `${}` braces plus a typo, so the literal string was used as the AWS secret | `@Value("${aws.secret.key}")` |
| 3 | `config/AdminBootstrap.java` (new) | `/admin/register` is admin-only, so the first admin could never be created | Seeds one admin from `app.bootstrap.admin.*`, only when the users table is empty |
| 4 | `controller/CategoryController.java` | Bare `@GetMapping` mapped reads to `/`; delete path missing a leading slash; bogus `software.amazon.awssdk.thirdparty.jackson` import; a new `ObjectMapper` per request | `/categories`, `/admin/categories/{id}`, import removed, mapper injected |
| 5 | `config/SecurityConfig.java` | Rules named `/category` and `/items`, which nothing mapped; `corsConfigurationSource()` was private so `cors()` found no bean | Matchers corrected, CORS source exposed as a `@Bean`, redundant `CorsFilter` removed, `OPTIONS` permitted |
| 6 | `filters/JwtRequestFilter.java` | Expired/tampered tokens threw out of the filter → HTTP 500 | Wrapped in try/catch; request continues unauthenticated → 401/403 |
| 7 | `util/JwtUtil.java` + `pom.xml` | jjwt 0.9.1 needs the removed `javax.xml.bind` and base64-decodes the secret (your 57-char key is not valid base64) | Upgraded to jjwt 0.12.6 (`jjwt-api`/`impl`/`jackson`), rewritten with `Keys.hmacShaKeyFor` and `parseSignedClaims`; `jaxb-api` dropped |
| 8 | `service/implementation/UserServiceImpl.java` | Class was `UserServiceIml`; `createUser` returned the pre-save entity so `createdAt`/`updatedAt` were null | Renamed; returns `userRepository.save(...)`; role defaulted and upper-cased |
| 9 | `service/implementation/FileUploadServiceImpl.java` | NPE on a filename with no extension and on `deleteFile(null)`; `.acl("public-read")` fails on buckets with ACLs disabled (the S3 default since 2023) | Null-safe; ACL removed — serve the bucket through a policy or CloudFront instead |
| 10 | `controller/AuthController.java` | `DisabledException` rethrown as a bare `Exception` → HTTP 500 | Returns 403 / 401 via `ResponseStatusException` |
| 11 | `application.properties` | MySQL password and JWT secret committed in plain text | Moved to environment variables; multipart limits added |

## Before running

Set these (or put them in a local, git-ignored `application-local.properties`):

```
DB_USERNAME, DB_PASSWORD
AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME
JWT_SECRET_KEY            # 32+ characters
BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD   # optional, first run only
```

Rotate the MySQL password and the JWT secret that were in the original file — both
have been sitting in the repository.

## Endpoints after the change

```
POST /api/v1.0/login                          public
POST /api/v1.0/encode                         public
GET  /api/v1.0/categories                     USER or ADMIN
POST /api/v1.0/admin/categories               ADMIN  (multipart: category + file)
DEL  /api/v1.0/admin/categories/{categoryId}  ADMIN
POST /api/v1.0/admin/register                 ADMIN
GET  /api/v1.0/admin/users                    ADMIN
DEL  /api/v1.0/admin/users/{userId}           ADMIN
```

Note: this sandbox has no access to Maven Central, so the project could not be
compiled here. Run `./mvnw clean verify` locally to confirm.
