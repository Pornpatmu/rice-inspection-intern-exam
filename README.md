# rice-inspection-intern-exam

## วิธีใช้งาน (Run With Docker)

โปรเจคนี้ใช้ Docker Compose สำหรับ:

* MySQL
* Backend API
* Frontend

---

##  1. สร้างไฟล์ `.env`

### `server-back/.env`

```env
DB_HOST=db
DB_PORT=3306
DB_USER=your-user         # e.g. root (from docker-compose)
DB_PASSWORD=your-password # e.g. 442544 (from docker-compose)
DB_NAME=rice_db
PORT=8000
FRONTEND_URL=http://localhost:3001
```

### `server-front/.env`

```env
VITE_API_BASE=http://localhost:8001
```

---

## หมายเหตุ

* ค่า `DB_USER` และ `DB_PASSWORD` ต้องตรงกับ `docker-compose.yml`
* โดยในโปรเจคนี้ใส่ค่าตัวอย่างใน docker-compose.yml เป็น:
  * `root`
  * `442544`

---

##  2. รันโปรเจค

```bash
docker compose up --build
```

---

##  3. เข้าใช้งาน

* Frontend → http://localhost:3001
* Backend → http://localhost:8001
* Example API → http://localhost:8001/standard

---

##  4. หยุดระบบ

```bash
docker compose down
```

---

##  5. Reset Database

```bash
docker compose down -v
docker compose up --build
```

---

##  Note

*สร้างไฟล์ `.env` ก่อนรัน ไม่งั้น backend จะ connect DB ไม่ได้
