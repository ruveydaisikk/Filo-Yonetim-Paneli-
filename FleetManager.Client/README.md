# Fleet Manager — Filo Yönetim Paneli

## Teknolojiler
- **Backend:** ASP.NET Core 9, Entity Framework Core, PostgreSQL
- **Frontend:** React + Vite, Axios

## Özellikler
- Araç ekleme, düzenleme, listeleme
- Soft delete (silinen kayıtlar DB'de korunur)
- Son 30 gün bakım raporu

## Kurulum

### Backend
```bash
cd FleetManager.API
dotnet run
```

### Frontend
```bash
cd FleetManager.Client
npm install
npm run dev
```