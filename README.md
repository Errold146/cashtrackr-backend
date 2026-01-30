# CashTrackr - Backend API

API REST construida con Express.js y TypeScript para administración de presupuestos y gastos.

## 🚀 Tecnologías

- **Node.js 18+**
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos
- **Sequelize ORM** - ORM para PostgreSQL
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails
- **Express Validator** - Validación de datos
- **CORS** - Control de acceso entre dominios
- **Dotenv** - Gestión de variables de entorno

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn
- Variables de entorno configuradas

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone <backend-repository>
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Base de datos (Neon)
DATABASE_URL=postgresql://neondb_owner:password@host/neondb?sslmode=require&channel_binding=require

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

**Notas importantes:**
- `DATABASE_URL`: Usa Neon para base de datos (gratuito)
- `EMAIL_PASS`: Para Gmail, usa App Passwords, no la contraseña normal
- `JWT_SECRET`: Usa una clave segura (mínimo 32 caracteres)
- `FRONTEND_URL`: Cambia según el entorno (dev/prod)

## 🏃 Ejecutar en Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### Endpoints principales:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/user` - Obtener usuario (requiere token)
- `PUT /api/auth/user` - Actualizar perfil
- `POST /api/auth/update-password` - Cambiar contraseña
- `GET /api/budgets` - Listar presupuestos
- `POST /api/budgets` - Crear presupuesto
- `GET /api/expenses` - Listar gastos
- `POST /api/expenses` - Crear gasto

## 🏗️ Build para Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuración (BD, email, limiter)
├── controllers/     # Lógica de negocio
├── middleware/      # Middlewares (auth, validación)
├── models/          # Modelos Sequelize
├── routes/          # Rutas API
├── emails/          # Plantillas de email
├── helpers/         # Funciones auxiliares
├── index.ts         # Entry point
└── server.ts        # Configuración del servidor
```

## 🔐 Seguridad

- ✅ CORS configurado con whitelist
- ✅ JWT con HTTP-only cookies
- ✅ Rate limiting implementado
- ✅ Validación de datos con express-validator
- ✅ Contraseñas encriptadas con bcrypt
- ✅ SSL/TLS para conexión a BD

## 🚀 Deployment

### Opción 1: Railway/Render/Heroku

1. Conecta tu repositorio
2. Configura variables de entorno
3. Usa comando: `npm run build && npm start`

### Opción 2: VPS (con PM2)

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📝 Notas de Desarrollo

- Las migraciones de BD se ejecutan automáticamente al iniciar
- Los emails se envían de forma asincrónica
- Los tokens JWT expiran en 30 días
- Rate limiting: 100 peticiones por 15 minutos

## 🐛 Troubleshooting

**Error de conexión a BD:**
- Verifica que `DATABASE_URL` sea correcto
- Asegúrate que Neon esté activo
- Comprueba la configuración SSL

**Emails no se envían:**
- Verifica credenciales SMTP
- Para Gmail, usa App Passwords
- Habilita "Aplicaciones menos seguras"

**Error de CORS:**
- Verifica que `FRONTEND_URL` sea correcto
- Asegúrate que coincida con el dominio del frontend

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en el repositorio.

## 👨‍💻 Autor

Errold Núñez Sánchez

## ✉️ Contacto
[![GitHub](https://img.shields.io/badge/GitHub-Errold146-181717?logo=github)](https://github.com/Errold146)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ErroldNúñezS-0A66C2?logo=linkedin)](https://linkedin.com/in/errold-núñez-sánchez) 
[![Email](https://img.shields.io/badge/Email-ErroldNúñezS-D14836?logo=gmail)](mailto:errold222@gmail.com)