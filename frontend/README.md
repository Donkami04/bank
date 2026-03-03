# ⚛️ BTG Pactual - Portal de Inversiones (Frontend)

Este es el cliente React construido con Vite que permite a los usuarios gestionar sus suscripciones a fondos de inversión de manera interactiva.

## 📁 Arquitectura por Features
El proyecto sigue una estructura modular para escalar fácilmente:
- `src/features/onboarding`: Maneja el registro simulado y sincronización con el backend.
- `src/features/funds`: Listado de fondos, tarjetas dinámicas y suscripciones.
- `src/features/transactions`: Historial operativo con actualizaciones en tiempo real.
- `src/api`: Cliente Axios centralizado con interceptores para el Header `x-user-id`.
- `src/context`: (Opcional) Contextos globales.

## 🛠️ Tecnologías
- **React 18** + **Vite**
- **Axios** (Peticiones HTTP)
- **Lucide React** (Iconografía Premium)
- **Framer Motion** (Animaciones - instalado para uso futuro)
- **Vanilla CSS** (Estilos a medida con Glassmorphism)

## 🚦 Ejecución Local

### 1. Variables de Entorno
Asegúrate de que el archivo `.env` apunte a tu API desplegada:
```env
VITE_API_URL=https://91iikk1qr7.execute-api.us-east-1.amazonaws.com/dev
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm install
npm run dev
```

El portal estará disponible en `http://localhost:5173`.

## ✨ Características Premium
- **Glassmorphism Design**: Interfaz moderna y translúcida.
- **Validación en Tiempo Real**: El botón de suscripción se desactiva si el saldo es insuficiente.
- **Diseño Responsivo**: Adaptado para tablets y escritorio.
- **Sincronización Automática**: Al suscribirse a un fondo, el saldo en el header y el historial se actualizan automáticamente.
