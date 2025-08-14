# 📚 MANUAL 1: E-COMMERCE BASE CON REACT + NODE.JS

## 📋 INFORMACIÓN DEL PROYECTO

**Proyecto:** Sistema E-commerce Completo (MANUAL 1 - BASE FUNCIONAL)  
**Tecnologías:** React + TypeScript + Node.js + Express  
**Fecha de Desarrollo:** Agosto 2025  
**Versión:** 1.0.0 (Base)  
**Autor:** Desarrollo Guiado Paso a Paso  
**Cronograma:** Sesión 1 - Fundamentos y Configuración Inicial

---

## ⚠️ IMPORTANTE: ESTE ES EL MANUAL 1 (BASE)

**Lo que lograremos en este manual:**
- ✅ Frontend + Backend funcionando perfectamente
- ✅ Carrito de compras completo
- ✅ Conexión entre React y Express
- ✅ Base sólida para expandir

**Lo que viene en próximos manuales:**
- **Manual 2:** Organización + React Router + Páginas
- **Manual 3:** MongoDB + Base de datos real
- **Manual 4:** Autenticación + JWT + Usuarios
- **Manual 5:** Sistema de órdenes avanzado
- **Manual 6:** Pagos con Stripe + Checkout
- **Manual 7:** Panel administrativo
- **Manual 8:** Deploy + Producción  

---

## 🎯 STACK TECNOLÓGICO (MANUAL 1)

### **FRONTEND**
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **TailwindCSS 3.4.14** - Framework de CSS utilitario
- **Axios** - Cliente HTTP para consumir APIs
- **Create React App** - Herramienta de construcción

### **BACKEND**
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista para Node.js
- **CORS** - Middleware para permitir solicitudes entre dominios
- **Datos en memoria** - Arrays simples (temporal)

### **HERRAMIENTAS DE DESARROLLO**
- **Visual Studio Code** - Editor de código
- **npm** - Gestor de paquetes
- **Nodemon** - Herramienta de desarrollo para reinicio automático

### **TECNOLOGÍAS QUE AGREGAREMOS EN PRÓXIMOS MANUALES:**
- **MongoDB + Mongoose** - Base de datos NoSQL (Manual 3)
- **JSON Web Tokens (JWT)** - Autenticación segura (Manual 4)
- **Bcryptjs** - Encriptación de contraseñas (Manual 4)
- **Stripe** - Procesamiento de pagos (Manual 6)
- **React Router** - Navegación entre páginas (Manual 2)
- **Context API** - Estado global avanzado (Manual 2)

---

## 🚀 OBJETIVOS DEL PROYECTO COMPLETO

### **MANUAL 1 - Base Funcional (LO QUE LOGRAMOS HOY):**
1. ✅ **Frontend funcional** con React + TypeScript + TailwindCSS
2. ✅ **Backend API REST** con Node.js + Express  
3. ✅ **Catálogo de productos** dinámico desde el backend
4. ✅ **Sistema de carrito de compras** completo y funcional
5. ✅ **Conexión frontend-backend** establecida y funcionando
6. ✅ **Diseño responsivo** y profesional con TailwindCSS

### **MANUAL 2 - Organización y Navegación (PRÓXIMO):**
7. 🔄 **Reorganización del código** en estructura profesional
8. 🔄 **Sistema de navegación** con React Router
9. 🔄 **Múltiples páginas** (Home, Contact, About, Products)
10. 🔄 **Layout system** (Header + Footer reutilizables)
11. 🔄 **Estado global** del carrito en todas las páginas

### **MANUAL 3 - Autenticación (SESIÓN 4-5 DEL CRONOGRAMA):**
12. 🔄 **Sistema de usuarios** completo
13. 🔄 **Autenticación JWT** segura
14. 🔄 **Páginas protegidas** (Login/Register)
15. 🔄 **Perfiles de usuario** funcionales

### **MANUAL 4 - Base de Datos (SESIÓN 3 DEL CRONOGRAMA):**
16. 🔄 **Conexión MongoDB** real
17. 🔄 **Modelos de datos** con Mongoose
18. 🔄 **CRUD completo** de productos
19. 🔄 **Persistencia de datos** real

### **MANUAL 5 - Funcionalidades Avanzadas (SESIÓN 6-12):**
20. 🔄 **Panel administrativo** funcional
21. 🔄 **Sistema de órdenes** completo
22. 🔄 **Gestión de inventario** 
23. 🔄 **Deploy en producción**

---

## 📁 ESTRUCTURA DEL PROYECTO (MANUAL 1)

### **Estructura Base Funcional:**
```
mi-tienda/
├── frontend/                    # Aplicación React
│   ├── public/                  # Archivos públicos
│   │   ├── index.html           # HTML principal
│   │   └── favicon.ico          # Icono de la aplicación
│   ├── src/                     # Código fuente
│   │   ├── App.tsx              # Componente principal (TODO EN UNO)
│   │   ├── index.tsx            # Punto de entrada
│   │   ├── index.css            # Estilos globales con Tailwind
│   │   └── App.test.tsx         # Pruebas (no modificar)
│   ├── package.json             # Dependencias del frontend
│   ├── tailwind.config.js       # Configuración de TailwindCSS
│   ├── postcss.config.js        # Configuración de PostCSS
│   └── node_modules/            # Módulos instalados
└── backend/                     # Servidor API
    ├── server.js                # Archivo principal del servidor
    ├── package.json             # Dependencias del backend
    ├── .env                     # Variables de entorno (opcional)
    └── node_modules/            # Módulos de Node.js
```

### **Estructura Objetivo (MANUAL 2 - Próximo):**
```
mi-tienda/
├── frontend/
│   └── src/
│       ├── components/          # 🆕 Componentes reutilizables
│       │   ├── layout/          # Header, Footer, Layout
│       │   ├── common/          # Button, Card, Loading
│       │   └── shop/            # ProductCard, CartItem
│       ├── pages/               # 🆕 Páginas separadas
│       │   ├── HomePage.tsx     # Página principal
│       │   ├── ContactPage.tsx  # Página de contacto
│       │   ├── AboutPage.tsx    # Acerca de nosotros
│       │   └── ProductsPage.tsx # Tienda de productos
│       ├── contexts/            # 🆕 Estado global
│       │   └── CartContext.tsx  # Manejo del carrito
│       └── App.tsx              # 🔄 Solo Router y Layout
└── backend/ (sin cambios)
```

---

## 🚀 GUÍA PASO A PASO COMPLETA

### **FASE 1: PREPARACIÓN DEL ENTORNO**

#### **Paso 1: Configurar Visual Studio Code**
1. Abrir Visual Studio Code
2. Ir a **File → Open Folder**
3. Navegar al Escritorio
4. Crear carpeta nueva llamada `mi-tienda`
5. Abrir esa carpeta en VS Code

#### **Paso 2: Abrir Terminal Integrada**
- Presionar **Ctrl + `** (comilla hacia atrás)
- Se abre terminal DENTRO de VS Code
- Verificar que estás en la carpeta `mi-tienda`

#### **Paso 3: Crear Estructura de Carpetas**
```bash
# Crear carpetas principales
mkdir frontend
mkdir backend

# Verificar que se crearon
dir  # En Windows
ls   # En Mac/Linux
```

**💡 Explicación:** Separamos frontend y backend para mantener el código organizado y permitir escalabilidad independiente.

---

### **FASE 2: CONFIGURACIÓN DEL FRONTEND**

#### **Paso 4: Crear Proyecto React**
```bash
# Navegar a la carpeta frontend
cd frontend

# Crear proyecto React con TypeScript
npx create-react-app . --template typescript
```

**⏳ Tiempo estimado:** 2-5 minutos  
**🎯 Resultado esperado:** Mensaje "Happy hacking!" al finalizar

**💡 Explicación:**
- `npx` ejecuta paquetes sin instalarlos globalmente
- `create-react-app` es la herramienta oficial de React
- `--template typescript` agrega soporte para TypeScript
- El `.` instala en la carpeta actual

#### **Paso 5: Instalar TailwindCSS**

**⚠️ PROBLEMA COMÚN:** Conflictos con versiones de Tailwind

**SOLUCIÓN APLICADA:**
```bash
# Instalar versión específica estable (evita conflictos)
npm install -D tailwindcss@3.4.14 postcss@8.4.49 autoprefixer@10.4.20

# Crear archivos de configuración
npx tailwindcss init -p
```

**💡 Explicación de versiones específicas:**
- `tailwindcss@3.4.14`: Versión estable de TailwindCSS v3
- `postcss@8.4.49`: Procesador CSS compatible
- `autoprefixer@10.4.20`: Agrega prefijos CSS automáticamente
- `-D`: Instala como dependencia de desarrollo

#### **Paso 6: Configurar TailwindCSS**

**Archivo: `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Define dónde buscar clases de Tailwind
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Todos los archivos en src/
  ],
  theme: {
    extend: {}, // Extensiones personalizadas del tema
  },
  plugins: [], // Plugins adicionales
}
```

**Archivo: `src/index.css`**
```css
/* Importar capas base de TailwindCSS */
@tailwind base;        /* Estilos de reset y base */
@tailwind components;  /* Componentes reutilizables */
@tailwind utilities;   /* Clases utilitarias */
```

**💡 Explicación:**
- `@tailwind base`: Normaliza estilos entre navegadores
- `@tailwind components`: Permite crear componentes con `@apply`
- `@tailwind utilities`: Todas las clases utilitarias de Tailwind

#### **Paso 7: Instalar Dependencias Adicionales**
```bash
# Axios para comunicación con el backend
npm install axios
```

**💡 Explicación de Axios:**
- Cliente HTTP basado en promesas
- Interceptors para manejo de errores
- Soporte para request/response interceptors
- Mejor que fetch() para APIs complejas

---

### **FASE 3: CONFIGURACIÓN DEL BACKEND**

#### **Paso 8: Configurar Servidor Node.js**
```bash
# Navegar al backend
cd ../backend

# Inicializar proyecto Node.js
npm init -y
```

**💡 Explicación de `npm init -y`:**
- Crea `package.json` con configuración por defecto
- `-y` acepta automáticamente todas las opciones predeterminadas

#### **Paso 9: Instalar Dependencias del Backend**
```bash
# Dependencias de producción
npm install express mongoose cors dotenv bcryptjs jsonwebtoken

# Dependencias de desarrollo
npm install -D nodemon
```

**💡 Explicación de cada dependencia:**

**Producción:**
- **express**: Framework web minimalista para Node.js
- **mongoose**: ODM para MongoDB (Object Document Mapping)
- **cors**: Middleware para Cross-Origin Resource Sharing
- **dotenv**: Carga variables de entorno desde archivo .env
- **bcryptjs**: Hashing de contraseñas seguro
- **jsonwebtoken**: Implementación de JSON Web Tokens

**Desarrollo:**
- **nodemon**: Reinicia automáticamente el servidor al detectar cambios

---

### **FASE 4: IMPLEMENTACIÓN DEL BACKEND**

#### **Paso 10: Crear Servidor Express**

**Archivo: `backend/server.js`**
```javascript
// IMPORTACIONES NECESARIAS
const express = require('express');        // Framework web
const cors = require('cors');              // Cross-Origin Resource Sharing
require('dotenv').config();                // Variables de entorno

// CREAR APLICACIÓN EXPRESS
const app = express();
const PORT = process.env.PORT || 5000;    // Puerto del servidor

// MIDDLEWARE GLOBAL
// Se ejecuta en cada petición HTTP
app.use(cors());           // Permite peticiones desde http://localhost:3000
app.use(express.json());   // Parsea automáticamente JSON del body

// DATOS DE EJEMPLO (Simulación de base de datos)
const productos = [
  {
    id: 1,
    name: "iPhone 14",
    price: 999,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    category: "Electronics"
  },
  {
    id: 2,
    name: "MacBook Air",
    price: 1299,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    category: "Electronics"
  }
];

// RUTAS DE LA API

// Ruta de prueba - Verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    message: '🛍️ Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Ruta para obtener todos los productos
app.get('/api/products', (req, res) => {
  try {
    // Simula una respuesta de base de datos
    res.json(productos);
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ 
      error: error.message,
      message: 'Error al obtener productos'
    });
  }
});

// Ruta para agregar un producto (POST)
app.post('/api/products', (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    
    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({ 
        message: 'Nombre y precio son obligatorios' 
      });
    }

    // Crear nuevo producto
    const newProduct = {
      id: productos.length + 1,  // ID autoincremental simple
      name,
      price: parseFloat(price),  // Asegurar que el precio es número
      image: image || 'https://via.placeholder.com/400',
      category: category || 'General'
    };

    // Agregar a la lista
    productos.push(newProduct);
    
    // Responder con el producto creado
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      message: 'Error al crear producto'
    });
  }
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}`);
  console.log(`🛍️ Productos en http://localhost:${PORT}/api/products`);
});
```

**💡 Explicación detallada:**

1. **Middleware CORS**: Permite que React (puerto 3000) se comunique con Express (puerto 5000)
2. **express.json()**: Convierte automáticamente el body de las peticiones a objetos JavaScript
3. **Datos en memoria**: Por simplicidad, guardamos productos en un array (más adelante usaremos MongoDB)
4. **Manejo de errores**: Try-catch para capturar y manejar errores apropiadamente
5. **Códigos de estado HTTP**: 200 (OK), 201 (Created), 400 (Bad Request), 500 (Server Error)

---

### **FASE 5: IMPLEMENTACIÓN DEL FRONTEND**

#### **Paso 11: Crear Aplicación React Completa**

**Archivo: `frontend/src/App.tsx`**
```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// DEFINICIÓN DE TIPOS TYPESCRIPT
// Define la estructura de un producto
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

function App() {
  // ESTADO DEL COMPONENTE USANDO HOOKS
  
  // Lista de productos obtenida del backend
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estado de carga para mostrar spinner
  const [loading, setLoading] = useState(true);
  
  // Carrito de compras (productos agregados)
  const [cart, setCart] = useState<Product[]>([]);

  // EFECTO PARA OBTENER PRODUCTOS AL CARGAR LA PÁGINA
  useEffect(() => {
    // Función asíncrona para obtener productos
    const fetchProducts = async () => {
      try {
        // Petición HTTP GET al backend
        const response = await axios.get('http://localhost:5000/api/products');
        
        // Actualizar estado con los productos obtenidos
        setProducts(response.data);
        setLoading(false);
        
        console.log('✅ Productos cargados:', response.data);
      } catch (error) {
        console.error('❌ Error obteniendo productos:', error);
        setLoading(false);
        
        // En caso de error, mostrar mensaje al usuario
        alert('Error al cargar productos. Verifica que el backend esté funcionando.');
      }
    };

    // Ejecutar la función al montar el componente
    fetchProducts();
  }, []); // Array vacío = se ejecuta solo una vez al montar

  // FUNCIONES PARA MANEJAR EL CARRITO

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    // Spread operator para crear nuevo array (inmutabilidad)
    setCart([...cart, product]);
    
    console.log(`📦 Producto agregado: ${product.name}`);
    
    // Feedback visual opcional
    alert(`${product.name} agregado al carrito!`);
  };

  // Remover producto del carrito
  const removeFromCart = (productId: number) => {
    // Filtrar productos que NO coincidan con el ID
    setCart(cart.filter(item => item.id !== productId));
    
    console.log(`🗑️ Producto removido del carrito`);
  };

  // Calcular total del carrito
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  // RENDERIZADO CONDICIONAL - PANTALLA DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          {/* Spinner de carga con animación CSS */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // RENDERIZADO PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER - Barra superior */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo y título */}
            <h1 className="text-3xl font-bold">🛍️ Mi Tienda Online</h1>
            
            {/* Botón del carrito con contador */}
            <div className="flex items-center space-x-4">
              <button className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                🛒 Carrito ({cart.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos Disponibles</h2>
        
        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            // CARD DE PRODUCTO
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Imagen del producto */}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.currentTarget.src = 'https://via.placeholder.com/400?text=Producto';
                }}
              />
              
              {/* Información del producto */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  Categoría: {product.category}
                </p>
                
                {/* Precio y botón */}
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 active:transform active:scale-95"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECCIÓN DEL CARRITO (se muestra solo si hay productos) */}
        {cart.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🛒 Carrito de Compras
            </h3>
            
            {/* Lista de productos en el carrito */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  {/* Información del producto en carrito */}
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-green-600 font-bold">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botón para eliminar */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              
              {/* Total y botón de pago */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>
                    Total: ${calculateTotal().toLocaleString()}
                  </span>
                  <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                    Proceder al Pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
```

**💡 Explicaciones clave del código:**

1. **TypeScript Interfaces**: Definen la estructura de datos y previenen errores
2. **React Hooks**:
   - `useState`: Maneja estado local del componente
   - `useEffect`: Ejecuta efectos secundarios (peticiones HTTP)
3. **Async/Await**: Manejo moderno de promesas
4. **Spread Operator**: `[...cart, product]` mantiene inmutabilidad del estado
5. **Renderizado condicional**: Muestra diferentes UI según el estado
6. **Event handlers**: Funciones que responden a interacciones del usuario
7. **TailwindCSS**: Clases utilitarias para styling rápido y responsivo

---

## ⚠️ PROBLEMAS ENCONTRADOS Y SOLUCIONES

### **Problema 1: Error de TailwindCSS**
**Error:** `"tailwind" no se reconoce como un comando interno`

**Causa:** Conflicto entre versiones de TailwindCSS (v3 vs v4)

**Solución aplicada:**
```bash
# Desinstalar versiones conflictivas
npm uninstall tailwindcss postcss autoprefixer

# Limpiar caché
npm cache clean --force

# Instalar versiones específicas estables
npm install -D tailwindcss@3.4.14 postcss@8.4.49 autoprefixer@10.4.20
```

### **Problema 2: Múltiples carpetas node_modules**
**Error:** Se creaban carpetas node_modules en lugares incorrectos

**Causa:** Ejecutar npm install en la carpeta raíz en lugar de subcarpetas

**Solución aplicada:**
- Estructura clara: `mi-tienda/frontend/` y `mi-tienda/backend/`
- Ejecutar comandos npm solo dentro de las carpetas correspondientes

### **Problema 3: CORS Error**
**Error:** `Access-Control-Allow-Origin` bloqueado

**Causa:** El navegador bloquea peticiones entre diferentes puertos (3000 → 5000)

**Solución aplicada:**
```javascript
// En server.js
const cors = require('cors');
app.use(cors()); // Permite todas las peticiones CORS
```

---

## 🧪 TESTING Y VERIFICACIÓN

### **Verificar Backend**
```bash
# Iniciar servidor
cd backend
node server.js

# Verificar en navegador:
# http://localhost:5000/ → {"message":"🛍️ Backend funcionando!"}
# http://localhost:5000/api/products → Array de productos
```

### **Verificar Frontend**
```bash
# Iniciar React
cd frontend
npm start

# Verificar en navegador:
# http://localhost:3000 → Aplicación React funcionando
# Productos cargados desde el backend
# Carrito funcional
```

### **Verificar Conexión Frontend-Backend**
1. **Agregar producto al carrito**
2. **Verificar contador del carrito**
3. **Verificar sección de carrito aparece**
4. **Verificar cálculo de total**
5. **Verificar eliminación de productos**

---

## 📊 MÉTRICAS DEL PROYECTO

**Líneas de código:**
- Backend: ~80 líneas
- Frontend: ~150 líneas
- Configuración: ~20 líneas
- **Total: ~250 líneas**

**Dependencias instaladas:**
- Frontend: 7 dependencias principales
- Backend: 6 dependencias principales

**Tiempo de desarrollo:** ~2 horas (incluyendo resolución de problemas)

**Funcionalidades implementadas:**
- ✅ Servidor API REST
- ✅ Catálogo de productos
- ✅ Carrito de compras
- ✅ Diseño responsivo
- ✅ Manejo de errores
- ✅ Comunicación frontend-backend

---

## 🚀 COMANDOS DE EJECUCIÓN

### **Iniciar el proyecto completo:**

**Terminal 1 - Backend:**
```bash
cd mi-tienda/backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd mi-tienda/frontend
npm start
```

### **URLs de acceso:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- API Productos: `http://localhost:5000/api/products`

---

## 📈 PRÓXIMOS PASOS Y ROADMAP

### **MANUAL 2: Organización y Navegación (Sesión 2 del cronograma)**
**Tiempo estimado:** 2-3 horas
- Reorganizar código actual en estructura profesional
- Implementar React Router para navegación
- Crear páginas: HomePage, ContactPage, AboutPage
- Implementar Layout con Header y Footer
- Estado global del carrito con Context API

### **MANUAL 3: Base de Datos MongoDB (Sesión 3 del cronograma)**  
**Tiempo estimado:** 3-4 horas
- Configurar MongoDB Atlas o local
- Crear modelos con Mongoose (User, Product, Order)
- Migrar datos de ejemplo a base de datos real
- Implementar CRUD completo de productos

### **MANUAL 4: Autenticación (Sesión 4-5 del cronograma)**
**Tiempo estimado:** 4-5 horas
- Sistema de registro y login
- Implementación JWT tokens
- Middleware de autenticación
- Páginas protegidas y roles de usuario

### **MANUAL 5: Catálogo Avanzado (Sesión 6-7 del cronograma)**
**Tiempo estimado:** 3-4 horas
- Filtros y búsqueda de productos
- Categorías y paginación
- Custom hooks para manejo de datos
- Optimización de performance

### **MANUAL 6: Carrito y Órdenes (Sesión 8-9 del cronograma)**
**Tiempo estimado:** 4-5 horas
- Sistema de órdenes completo
- Proceso de checkout
- Gestión de inventario
- Historial de compras

### **MANUAL 7: Panel Administrativo (Sesión 10 del cronograma)**
**Tiempo estimado:** 3-4 horas
- Dashboard de administración
- Gestión de productos y usuarios
- Métricas y reportes básicos
- Roles y permisos

### **MANUAL 8: Optimización y Deploy (Sesión 11-12 del cronograma)**
**Tiempo estimado:** 3-4 horas
- Optimización de performance
- Testing básico
- Deploy a producción (Vercel + Railway/Heroku)
- Documentación final

---

## 📝 CONCLUSIONES DEL MANUAL 1

Este Manual 1 establece una **base sólida y funcional** para nuestro e-commerce. Hemos implementado:

### **✅ Logros del Manual 1:**
1. **Arquitectura separada**: Frontend React y Backend Express independientes
2. **Comunicación HTTP**: API REST con endpoints claros y funcionales
3. **Estado reactivo**: React hooks para gestión de estado del carrito
4. **Diseño moderno**: TailwindCSS para UI responsive y profesional
5. **Tipado fuerte**: TypeScript para mejor desarrollo y menos errores
6. **Manejo de errores**: Try-catch y validaciones básicas implementadas

### **🚀 Preparación para próximos manuales:**
- **Código limpio y comentado** para fácil refactoring
- **Estructura base** lista para expandir
- **Funcionalidades core** probadas y funcionando
- **Conexión frontend-backend** establecida y estable

### **📈 Evolución del proyecto:**
El proyecto está **listo para escalar** y agregar funcionalidades más complejas:
- **Manual 2**: Organización profesional + React Router
- **Manual 3**: Persistencia real con MongoDB
- **Manual 4**: Seguridad con autenticación JWT
- **Manual 5+**: Funcionalidades avanzadas según cronograma

### **🎯 Estado actual:**
- ✅ **E-commerce básico 100% funcional**
- ✅ **2 productos de ejemplo funcionando**
- ✅ **Carrito completo con agregar/eliminar/total**
- ✅ **Diseño responsive y profesional**
- ✅ **Base sólida para 12 sesiones de desarrollo**

**El Manual 1 cumple perfectamente con la Sesión 1 del cronograma: "Fundamentos y Configuración Inicial" ✅**

---

**© 2025 - Manual 1: Base funcional del E-commerce**  
**Próximo: Manual 2 - Organización y Navegación con React Router**