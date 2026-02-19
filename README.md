# Praxis-Dashboard

Kleines Praxis-Dashboard (Angular 21, CSR) mit den Bereichen:
- Dashboard (Statistiken)
- Patients (Liste/CRUD)
- Appointments (Liste + Kollisionscheck)

## Tech-Stack
- Angular 21 (CSR, no SSR)
- Angular Material
- json-server (Mock REST API)

## Lokales Setup (Windows)
### 1) Dependencies installieren
npm ci

### 2) Mock API starten
npx json-server --watch db.json --port 3000

### 3) Angular Dev Server starten
npm start
# oder: ng serve

Dann öffnen:
http://localhost:4200
