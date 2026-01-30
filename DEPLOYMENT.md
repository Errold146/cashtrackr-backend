# 🚀 Guía de Deployment - Backend

## Pre-Deploy Checklist

- [ ] Variables de entorno configuradas correctamente
- [ ] Base de datos Neon creada y URL verificada
- [ ] Email configurado y probado
- [ ] JWT_SECRET cambió de valor por defecto
- [ ] FRONTEND_URL apunta al dominio correcto
- [ ] Tests pasados `npm run build`
- [ ] No hay errores en la consola
- [ ] CORS whitelist incluye dominio frontend

## Opciones de Deployment

### 1. Railway (Recomendado para simplificar)

**Pasos:**

1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta GitHub
3. Crea nuevo proyecto
4. Selecciona tu repositorio
5. Agrega variables de entorno
6. Deploy automático

**Variables en Railway:**
```
DATABASE_URL=postgresql://...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
JWT_SECRET=clave_super_segura
FRONTEND_URL=https://tudominio.com
NODE_ENV=production
```

### 2. Render

**Pasos:**

1. Ve a [render.com](https://render.com)
2. Conecta GitHub
3. Crea "New Web Service"
4. Configura:
   - Build: `npm install && npm run build`
   - Start: `npm start`
5. Agrega variables de entorno
6. Deploy

### 3. Heroku

**Pasos:**

1. Instala Heroku CLI
2. Login: `heroku login`
3. Crea app: `heroku create tu-app-name`
4. Agrega variables: `heroku config:set KEY=VALUE`
5. Deploy: `git push heroku main`

### 4. VPS Propio (AWS EC2, DigitalOcean, etc)

**Pasos:**

1. SSH a tu servidor
2. Instala Node.js 18+
3. Clona el repositorio
4. Configura `.env`
5. Instala PM2: `npm install -g pm2`
6. Inicia con PM2: `pm2 start ecosystem.config.js`
7. Guarda config: `pm2 save && pm2 startup`

**Usando systemd (alternativa a PM2):**

Crea `/etc/systemd/system/cashtrackr-backend.service`:
```ini
[Unit]
Description=CashTrackr Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/home/username/cashtrackr/backend
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable cashtrackr-backend
sudo systemctl start cashtrackr-backend
sudo systemctl status cashtrackr-backend
```

## Variables de Entorno por Ambiente

### Desarrollo
```
NODE_ENV=development
DATABASE_URL=postgresql://localhost/cashtrackr
FRONTEND_URL=http://localhost:3000
```

### Producción
```
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:...@host/neondb
FRONTEND_URL=https://tudominio.com
JWT_SECRET=clave_muy_segura_minimo_32_caracteres
```

## Configurar Dominio y SSL

### Con Nginx (VPS Propio)

```nginx
server {
    listen 80;
    server_name api.tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/api.tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tudominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Obtener SSL con Let's Encrypt:
```bash
sudo certbot certonly --standalone -d api.tudominio.com
```

### Con Cloudflare

1. Agrega tu dominio a Cloudflare
2. Configura nameservers
3. Crea registro CNAME: `api` → tu-ip
4. Activa SSL flexible/full
5. Listo, tiene HTTPS automático

## Monitoreo y Logs

### Con PM2

```bash
# Ver logs en tiempo real
pm2 logs cashtrackr-backend

# Ver estadísticas
pm2 monit

# Ver histórico de errores
pm2 dump
```

### Con Systemd

```bash
# Ver logs
journalctl -u cashtrackr-backend -f

# Ver últimas 50 líneas
journalctl -u cashtrackr-backend -n 50
```

### Logging a archivo

Actualiza `src/index.ts`:
```typescript
import fs from 'fs';
const logStream = fs.createWriteStream('logs/app.log', { flags: 'a' });
// Redirige console.log a archivo
```

## Backup de Base de Datos

### Con Neon

1. Ve a dashboard de Neon
2. Usa herramienta de backup integrada
3. O exporta manualmente: `pg_dump`

### Script de backup automático

```bash
#!/bin/bash
DATE=$(date +\%Y\%m\%d_\%H\%M\%S)
BACKUP_DIR="/backups"

pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Subir a S3 o storage cloud
```

## Mantenimiento y Actualizaciones

### Actualizar dependencias

```bash
npm update
npm audit fix
npm run build
pm2 restart cashtrackr-backend
```

### Rollback a versión anterior

Con Git:
```bash
git log --oneline
git revert <commit-hash>
npm install
npm run build
pm2 restart all
```

## Troubleshooting

**La app inicia pero no responde a requests:**
- Verifica CORS: `FRONTEND_URL` debe ser exacto
- Comprueba que puerto 4000 esté abierto
- Revisa firewall del servidor

**Error de conexión a BD:**
- Verifica `DATABASE_URL` con Neon
- Prueba conexión: `psql $DATABASE_URL`
- Comprueba SSL settings

**Emails no se envían en producción:**
- Verifica credenciales SMTP
- Comprueba logs: `pm2 logs`
- Prueba manualmente en backend

**Memory leak/consumo alto:**
- Monitorea con `pm2 monit`
- Revisa queries a BD
- Implementa pooling de conexiones

## Métricas y Performance

### Optimizaciones recomendadas:

1. **Compresión:**
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Caching:**
```typescript
import redis from 'redis';
const client = redis.createClient();
```

3. **Rate limiting:**
```typescript
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
```

## Soporte post-deploy

- Monitorea logs regularmente
- Ten una estrategia de rollback
- Mantén backups diarios
- Documenta cambios
- Comunica cambios al equipo frontend
