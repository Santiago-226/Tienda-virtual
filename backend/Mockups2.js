// DATOS DE EJEMPLO (Simulación de base de datos)
const productos = [
    {
      "id": 1,
      "nombre": "Semillas de Maíz Premium Variedad Híbrida",
      "precio": 55000,
      "precioOriginal": 55000,
      "images": [
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Semillas de maíz híbrido de alta calidad, especialmente desarrolladas para el clima colombiano. Ofrecen alta resistencia a plagas y excelente rendimiento.",
      "caracteristicas": [
        "Alta resistencia a plagas y enfermedades",
        "Adaptado al clima tropical y subtropical",
        "Ciclo de cultivo de 120-130 días",
        "Alto potencial de rendimiento (8-12 ton/ha)",
        "Excelente calidad de grano",
        "Resistente a sequía moderada",
        "Certificación INIA"
      ],
      "especificaciones": {
        "Variedad": "Híbrido F1",
        "Ciclo vegetativo": "120-130 días",
        "Altura de planta": "2.2 - 2.5 metros",
        "Rendimiento esperado": "8-12 ton/ha",
        "Densidad de siembra": "55,000 - 65,000 plantas/ha",
        "Época de siembra": "Marzo - Junio",
        "Tipo de grano": "Semidentado amarillo",
        "Humedad del grano": "14% máximo"
      },
      "stock": 150,
      "rating": 5,
      "totalReviews": 127,
      "marca": "AgroTienda Premium",
      "sku": "AGT-MAZ-001",
      "peso": "25 kg",
      "dimensiones": "45 x 30 x 15 cm",
      "garantia": "Garantía de germinación del 85%",
      "incluye": [
        "1 bolsa de 25kg de semillas",
        "Manual de cultivo",
        "Certificado de calidad",
        "Guía de siembra"
      ]
    },
    {
      "id": 2,
      "nombre": "Fertilizante Triple 15 Completo",
      "precio": 78000,
      "precioOriginal": 89000,
      "images": [
        "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1618485451585-873391ce0c91?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Fertilizante balanceado NPK 15-15-15 con micronutrientes esenciales para el crecimiento óptimo de tus cultivos.",
      "caracteristicas": [
        "Balance perfecto de nitrógeno, fósforo y potasio",
        "Incluye micronutrientes esenciales",
        "Fórmula de liberación controlada",
        "Apto para todo tipo de cultivos",
        "Aumenta la resistencia de las plantas",
        "Mejora la calidad del suelo"
      ],
      "especificaciones": {
        "Composición": "NPK 15-15-15",
        "Peso": "50 kg",
        "Tipo": "Granulado",
        "Aplicación": "250-400 kg/ha",
        "Duración": "60-90 días",
        "Disolución": "Lenta y progresiva"
      },
      "stock": 85,
      "rating": 4.6,
      "totalReviews": 94,
      "marca": "NutriCrop",
      "sku": "NCR-FER-015",
      "peso": "50 kg",
      "dimensiones": "60 x 35 x 15 cm",
      "garantia": "Garantía de calidad certificada",
      "incluye": [
        "1 saco de 50kg de fertilizante",
        "Guía de aplicación",
        "Medidor de pH gratuito"
      ]
    },
    {
      "id": 3,
      "nombre": "Sistema de Riego por Goteo 100m",
      "precio": 185000,
      "precioOriginal": 215000,
      "images": [
        "https://plus.unsplash.com/premium_photo-1661825536186-19606cd9a0f1?q=80&w=1619&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Kit completo de riego por goteo para 100 metros lineales, ideal para optimizar el uso de agua en cultivos.",
      "caracteristicas": [
        "Ahorra hasta 60% de agua",
        "Fácil instalación",
        "Tubería resistente a UV",
        "Goteros anti-obstrucción",
        "Incluye todos los accesorios",
        "Presión de trabajo: 1-3 bar"
      ],
      "especificaciones": {
        "Longitud": "100 metros",
        "Caudal por gotero": "2 L/h",
        "Distancia entre goteros": "30 cm",
        "Material": "Polietileno",
        "Diámetro": "16 mm",
        "Incluye": "Conectores, terminales, llaves"
      },
      "stock": 42,
      "rating": 4.7,
      "totalReviews": 68,
      "marca": "AquaCultivo",
      "sku": "AQC-RGO-100",
      "peso": "8.5 kg",
      "dimensiones": "40 x 25 x 15 cm",
      "garantia": "2 años contra defectos de fabricación",
      "incluye": [
        "Tubería de 100m",
        "500 goteros",
        "Conectores y accesorios",
        "Manual de instalación"
      ]
    },
    {
      "id": 4,
      "nombre": "Invernadero Tunel 6x10m",
      "precio": 1250000,
      "precioOriginal": 1450000,
      "images": [
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1572981779307-1028981c51d6?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Invernadero tipo túnel de 6x10 metros, estructura galvanizada y cubierta de polietileno UV protegido.",
      "caracteristicas": [
        "Estructura galvanizada anticorrosión",
        "Cubierta de polietileno 720 galgas",
        "Protección UV 100%",
        "Incluye sistema de ventilación",
        "Resistente a vientos hasta 80 km/h",
        "Fácil montaje"
      ],
      "especificaciones": {
        "Dimensiones": "6m x 10m x 3m",
        "Material estructura": "Acero galvanizado",
        "Espesor cubierta": "720 micras",
        "Vida útil": "5-7 años",
        "Transmisión luz": "85%",
        "Incluye": "Estructura, cubierta, accesorios"
      },
      "stock": 15,
      "rating": 4.9,
      "totalReviews": 37,
      "marca": "GreenHouse Pro",
      "sku": "GHP-INV-610",
      "peso": "180 kg",
      "dimensiones": "Paquete 200 x 40 x 40 cm",
      "garantia": "3 años en estructura, 2 en cubierta",
      "incluye": [
        "Estructura completa",
        "Cubierta de polietileno",
        "Sistema de anclaje",
        "Manual de montaje"
      ]
    },
    {
      "id": 5,
      "nombre": "Tractor Agrícola 25HP Diésel",
      "precio": 38500000,
      "precioOriginal": 42500000,
      "images": [
        "https://images.unsplash.com/photo-1614977645540-7abd88ba8e56?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1622746277797-52c138abee43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622746277797-52c138abee43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571757767119-68b8db11f692?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Tractor agrícola compacto de 25HP, motor diésel, ideal para pequeñas y medianas explotaciones agrícolas.",
      "caracteristicas": [
        "Motor diésel 3 cilindros",
        "Potencia 25 HP",
        "Tracción 4x4 opcional",
        "Consumo eficiente",
        "Bajo nivel de ruido",
        "Fácil mantenimiento"
      ],
      "especificaciones": {
        "Motor": "Diésel 3 cilindros",
        "Potencia": "25 HP",
        "Transmisión": "8+2 velocidades",
        "Capacidad tanque": "25 L",
        "Peso": "950 kg",
        "Toma de fuerza": "540 rpm"
      },
      "stock": 7,
      "rating": 4.8,
      "totalReviews": 23,
      "marca": "AgroTractor",
      "sku": "ATR-025D",
      "peso": "950 kg",
      "dimensiones": "250 x 130 x 140 cm",
      "garantia": "2 años o 2000 horas",
      "incluye": [
        "Tractor básico",
        "Documentación",
        "Kit de herramientas",
        "Manual de usuario"
      ]
    },
    {
      "id": 6,
      "nombre": "Herbicida Selectivo Post-emergente",
      "precio": 125000,
      "precioOriginal": 145000,
      "images": [
        "https://agroactivocol.com/wp-content/uploads/2022/08/Verdict-1.png",
        "https://plus.unsplash.com/premium_photo-1661942064041-a15c0c93d2a5?q=80&w=2703&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1596195689405-2e6d5ca3bb39?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Herbicida selectivo post-emergente para control de malezas de hoja ancha en cultivos de cereales.",
      "caracteristicas": [
        "Control efectivo de malezas",
        "Selectivo para cereales",
        "Acción rápida",
        "Baja toxicidad",
        "Residualidad controlada",
        "Aplicación foliar"
      ],
      "especificaciones": {
        "Principio activo": "2,4-D Amina",
        "Concentración": "48%",
        "Dosis": "1-2 L/ha",
        "Periodo de carencia": "30 días",
        "Presentación": "Líquido emulsionable",
        "Volumen": "10 L"
      },
      "stock": 56,
      "rating": 4.4,
      "totalReviews": 89,
      "marca": "AgroProtect",
      "sku": "APC-HRB-248",
      "peso": "11.5 kg",
      "dimensiones": "35 x 25 x 25 cm",
      "garantia": "Garantía de eficacia",
      "incluye": [
        "Bidón de 10L",
        "Guía de aplicación",
        "Equipo de protección"
      ]
    },
    {
      "id": 7,
      "nombre": "Aspersora Manual de Mochila 20L",
      "precio": 185000,
      "precioOriginal": 210000,
      "images": [
        "https://http2.mlstatic.com/D_NQ_NP_2X_876546-MLU78492533471_082024-T.webp",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Aspersora manual de mochila con capacidad de 20 litros, ideal para aplicación precisa de agroquímicos.",
      "caracteristicas": [
        "Capacidad 20 litros",
        "Presión constante",
        "Lanza de bronce regulable",
        "Correas ajustables",
        "Filtro incorporado",
        "Fácil mantenimiento"
      ],
      "especificaciones": {
        "Capacidad": "20 L",
        "Material": "Polietileno",
        "Presión": "3-4 bar",
        "Alcance": "8-10 m",
        "Peso vacío": "4.2 kg",
        "Incluye": "Lanza, boquillas, repuestos"
      },
      "stock": 34,
      "rating": 4.5,
      "totalReviews": 76,
      "marca": "SprayMax",
      "sku": "SPM-ASP-20",
      "peso": "4.2 kg",
      "dimensiones": "45 x 35 x 20 cm",
      "garantia": "1 año contra defectos",
      "incluye": [
        "Mochila aspersora",
        "Boquillas intercambiables",
        "Kit de mantenimiento",
        "Manual de uso"
      ]
    },
    {
      "id": 8,
      "nombre": "Semillas de Papa Criolla Colombia",
      "precio": 32000,
      "precioOriginal": 38000,
      "images": [
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Semillas certificadas de papa criolla colombiana, variedad de alto rendimiento y excelente calidad culinaria.",
      "caracteristicas": [
        "Variedad criolla colombiana",
        "Alto rendimiento",
        "Resistente a plagas",
        "Sabor auténtico",
        "Ciclo corto",
        "Adaptación andina"
      ],
      "especificaciones": {
        "Variedad": "Criolla Colombia",
        "Ciclo": "90-100 días",
        "Rendimiento": "15-20 ton/ha",
        "Tubérculos/planta": "8-12",
        "Calibre": "Mediano",
        "Certificación": "ICA"
      },
      "stock": 200,
      "rating": 4.7,
      "totalReviews": 114,
      "marca": "Semillas Andinas",
      "sku": "SAC-PAP-CCR",
      "peso": "25 kg",
      "dimensiones": "50 x 30 x 15 cm",
      "garantia": "Garantía de germinación 90%",
      "incluye": [
        "Saco de 25kg",
        "Certificado fitosanitario",
        "Guía de cultivo"
      ]
    },
    {
      "id": 9,
      "nombre": "Malla Sombra 70% 4x50m",
      "precio": 185000,
      "precioOriginal": 220000,
      "images": [
        "https://http2.mlstatic.com/D_NQ_NP_925314-MLU77966344482_082024-O.webp",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1572981779307-1028981c51d6?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Malla sombra de polipropileno con 70% de bloqueo solar, ideal para proteger cultivos de la radiación excesiva.",
      "caracteristicas": [
        "70% sombreado",
        "Resistente a UV",
        "Material polipropileno",
        "Ligera y durable",
        "Fácil instalación",
        "Permite circulación de aire"
      ],
      "especificaciones": {
        "Dimensiones": "4m x 50m",
        "Material": "Polipropileno",
        "Protección UV": "100%",
        "Vida útil": "5 años",
        "Color": "Verde oscuro",
        "Peso": "12 kg"
      },
      "stock": 28,
      "rating": 4.6,
      "totalReviews": 63,
      "marca": "AgroCover",
      "sku": "AGC-MSL-70",
      "peso": "12 kg",
      "dimensiones": "40 x 30 x 15 cm",
      "garantia": "2 años contra degradación UV",
      "incluye": [
        "Malla 4x50m",
        "Cuerdas de fijación",
        "Manual de instalación"
      ]
    },
    {
      "id": 10,
      "nombre": "Abono Orgánico Humus de Lombriz",
      "precio": 45000,
      "precioOriginal": 52000,
      "images": [
        "https://www.agrotecnia.co/wp-content/uploads/2023/03/ORBIAGRO.png",
        "https://images.unsplash.com/photo-1610824355625-92183568c263?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1610824355625-92183568c263?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Humus de lombriz 100% orgánico, enriquecido con microorganismos benéficos para mejorar la fertilidad del suelo.",
      "caracteristicas": [
        "100% orgánico",
        "Mejora estructura del suelo",
        "Alta carga microbiana",
        "Fuente de nutrientes",
        "Retención de humedad",
        "Ecológico y sostenible"
      ],
      "especificaciones": {
        "Volumen": "40 L",
        "Materia orgánica": "25%",
        "Nitrógeno": "2%",
        "Fósforo": "1.5%",
        "Potasio": "1.8%",
        "pH": "6.5-7.5"
      },
      "stock": 120,
      "rating": 4.9,
      "totalReviews": 156,
      "marca": "EcoSoil",
      "sku": "ECS-HUM-40L",
      "peso": "15 kg",
      "dimensiones": "50 x 30 x 20 cm",
      "garantia": "Calidad certificada",
      "incluye": [
        "Saco de 40L",
        "Guía de aplicación",
        "Análisis de calidad"
      ]
    },
    {
      "id": 11,
      "nombre": "Podadora de Altura Profesional",
      "precio": 285000,
      "precioOriginal": 320000,
      "images": [
        "https://www.atrial.com.co/wp-content/uploads/2022/01/podadora-con-motor-a-gasolina-4hp-de-18-2fc.jpg",
        "https://images.unsplash.com/photo-1597481485088-5d07a1a45c4e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1597481485088-5d07a1a45c4e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Podadora de altura profesional con motor a gasolina, ideal para mantenimiento de árboles frutales y ornamentales.",
      "caracteristicas": [
        "Motor 2 tiempos 25cc",
        "Vara extensible 2-4m",
        "Cadena de corte profesional",
        "Encendido fácil",
        "Bajo nivel de vibración",
        "Ligera y balanceada"
      ],
      "especificaciones": {
        "Motor": "25cc 2T",
        "Longitud vara": "2-4m ajustable",
        "Espada": "12 pulgadas",
        "Peso": "5.8 kg",
        "Combustible": "Gasolina混合",
        "Nivel ruido": "95 dB"
      },
      "stock": 18,
      "rating": 4.7,
      "totalReviews": 45,
      "marca": "ForestPro",
      "sku": "FSP-POD-25",
      "peso": "5.8 kg",
      "dimensiones": "120 x 25 x 15 cm",
      "garantia": "1 año en motor",
      "incluye": [
        "Podadora completa",
        "Aceite para mezclar",
        "Herramientas de mantenimiento",
        "Manual de usuario"
      ]
    },
    {
      "id": 12,
      "nombre": "Bioinsecticida Neem Orgánico",
      "precio": 35000,
      "precioOriginal": 42000,
      "images": [
        "https://cdn.croper.com/images/vx14xbt0mq3byxyrkqw56/original.jpeg",
        "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1596195689405-2e6d5ca3bb39?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Insecticida biológico a base de extracto de neem, efectivo contra plagas y respetuoso con el medio ambiente.",
      "caracteristicas": [
        "100% orgánico",
        "Base extracto de neem",
        "Control de plagas eficaz",
        "No daña insectos benéficos",
        "Biodegradable",
        "Sin periodo de carencia"
      ],
      "especificaciones": {
        "Concentración": "1000 ppm",
        "Dosis": "2-3 ml/L",
        "Aplicación": "Foliar",
        "Cadencia": "7-10 días",
        "Presentación": "Líquido concentrado",
        "Volumen": "1 L"
      },
      "stock": 95,
      "rating": 4.6,
      "totalReviews": 128,
      "marca": "BioProtect",
      "sku": "BPT-NEM-1L",
      "peso": "1.1 kg",
      "dimensiones": "15 x 10 x 8 cm",
      "garantia": "Eficacia garantizada",
      "incluye": [
        "Frasco 1L concentrado",
        "Gotero dosificador",
        "Guía de aplicación"
      ]
    },
    {
      "id": 13,
      "nombre": "Sistema Hidropónico Básico 20 Plantas",
      "precio": 285000,
      "precioOriginal": 335000,
      "images": [
        "https://hidrosystems.org/wp-content/uploads/2022/08/Diapositiva5.jpg",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Kit inicial de cultivo hidropónico para 20 plantas, ideal para comenzar en el mundo de la hidroponía doméstica.",
      "caracteristicas": [
        "Sistema NFT (Nutrient Film Technique)",
        "Para 20 plantas",
        "Incluye bomba de agua",
        "Bajo consumo energético",
        "Fácil montaje",
        "Ideal para hortalizas"
      ],
      "especificaciones": {
        "Capacidad": "20 plantas",
        "Bomba": "600 L/h",
        "Depósito": "30 L",
        "Tubería": "PVC alimentario",
        "Consumo": "25W",
        "Dimensiones": "150x50x30 cm"
      },
      "stock": 22,
      "rating": 4.8,
      "totalReviews": 57,
      "marca": "HydroGrow",
      "sku": "HYD-KIT-20",
      "peso": "12 kg",
      "dimensiones": "160 x 60 x 40 cm",
      "garantia": "1 año en componentes eléctricos",
      "incluye": [
        "Estructura completa",
        "Bomba de agua",
        "Sustrato para 20 plantas",
        "Nutrientes iniciales",
        "Manual de cultivo"
      ]
    },
    {
      "id": 14,
      "nombre": "Microorganismos Efectivos EM",
      "precio": 42000,
      "precioOriginal": 52000,
      "images": [
        "https://elganadero.pe/wp-content/uploads/2023/03/EM1-1-Litro-Agro-EM%E2%80%A21%C2%AE-Microorganismo-Eficaces-para-Activar-el-Suelo.jpg",
        "https://images.unsplash.com/photo-1610824355625-92183568c263?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1610824355625-92183568c263?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Consorcio de microorganismos efectivos (EM) para mejorar la salud del suelo y el crecimiento vegetal.",
      "caracteristicas": [
        "Mejora la microbiota del suelo",
        "Acelera descomposición materia orgánica",
        "Suprime patógenos",
        "Aumenta disponibilidad nutrientes",
        "100% natural",
        "Fácil aplicación"
      ],
      "especificaciones": {
        "Volumen": "1 L",
        "Microorganismos": "Lactobacilos, levaduras, actinomicetos",
        "Dilución": "1:100",
        "Caducidad": "6 meses",
        "Almacenamiento": "Lugar fresco y oscuro",
        "Aplicación": "Riego o foliar"
      },
      "stock": 75,
      "rating": 4.7,
      "totalReviews": 93,
      "marca": "MicroVida",
      "sku": "MCV-EM-1L",
      "peso": "1.2 kg",
      "dimensiones": "12 x 12 x 18 cm",
      "garantia": "Calidad microbiológica garantizada",
      "incluye": [
        "Frasco 1L concentrado",
        "Dosificador",
        "Guía de uso"
      ]
    },
    {
      "id": 15,
      "nombre": "Cosechadora de Maní Manual",
      "precio": 185000,
      "precioOriginal": 220000,
      "images": [
        "https://www.peanuts-machine.com/wp-content/uploads/2022/10/structure-of-peanut-digger-machine.webp",
        "https://images.unsplash.com/photo-1571757767119-68b8db11f692?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571757767119-68b8db11f692?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622746277797-52c138abee43?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Cosechadora manual de maní que facilita la extracción de vainas sin dañar los granos, aumentando la eficiencia.",
      "caracteristicas": [
        "Extracción limpia de vainas",
        "Mínimo daño a granos",
        "Mecanismo manual",
        "Acero resistente",
        "Fácil operación",
        "Ahorro de tiempo"
      ],
      "especificaciones": {
        "Material": "Acero al carbono",
        "Capacidad": "50 kg/hora",
        "Peso": "15 kg",
        "Dimensiones": "120x60x80 cm",
        "Eficiencia": "95% granos intactos",
        "Tipo": "Manual"
      },
      "stock": 12,
      "rating": 4.5,
      "totalReviews": 34,
      "marca": "CosechaFácil",
      "sku": "CSF-MAN-001",
      "peso": "15 kg",
      "dimensiones": "120 x 60 x 80 cm",
      "garantia": "6 meses",
      "incluye": [
        "Cosechadora completa",
        "Herramientas de mantenimiento",
        "Manual de uso"
      ]
    },
    {
      "id": 16,
      "nombre": "Sensor de Humedad de Suelo",
      "precio": 85000,
      "precioOriginal": 105000,
      "images": [
        "https://acortes.co/wp-content/uploads/2021/05/Sensor_HumedadTierra.jpg",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Sensor digital de humedad del suelo con display LCD, ideal para optimizar el riego y ahorrar agua.",
      "caracteristicas": [
        "Medición precisa de humedad",
        "Display LCD claro",
        "Sonda de 20 cm",
        "Batería incluida",
        "Fácil lectura",
        "Ahorro de agua garantizado"
      ],
      "especificaciones": {
        "Rango medición": "0-100% humedad",
        "Precisión": "±2%",
        "Longitud sonda": "20 cm",
        "Alimentación": "Batería 9V",
        "Display": "LCD",
        "Temperatura trabajo": "0-50°C"
      },
      "stock": 65,
      "rating": 4.6,
      "totalReviews": 87,
      "marca": "SmartFarm",
      "sku": "SMT-SNS-HUM",
      "peso": "0.3 kg",
      "dimensiones": "20 x 10 x 5 cm",
      "garantia": "1 año",
      "incluye": [
        "Sensor con display",
        "Sonda de medición",
        "Batería 9V",
        "Manual de uso"
      ]
    },
    {
      "id": 17,
      "nombre": "Semillas de Zanahoria Tropical",
      "precio": 18000,
      "precioOriginal": 22000,
      "images": [
        "https://mygarden.com.co/wp-content/uploads/2020/01/SEMILLAS-DE-ZANAHORIA-BERLICUN-BIO.jpg",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Semillas de zanahoria adaptada a climas tropicales, raíz uniforme y excelente sabor, alta productividad.",
      "caracteristicas": [
        "Adaptada a trópico",
        "Raíz uniforme",
        "Alto rendimiento",
        "Resistente a enfermedades",
        "Ciclo corto",
        "Excelente sabor"
      ],
      "especificaciones": {
        "Variedad": "Tropicalia F1",
        "Ciclo": "70-80 días",
        "Longitud raíz": "18-22 cm",
        "Color": "Naranja intenso",
        "Rendimiento": "40-50 ton/ha",
        "Germinación": "85%"
      },
      "stock": 175,
      "rating": 4.7,
      "totalReviews": 102,
      "marca": "HortiSemillas",
      "sku": "HTS-ZAN-TRP",
      "peso": "100 g",
      "dimensiones": "15 x 10 x 2 cm",
      "garantia": "Garantía de germinación 80%",
      "incluye": [
        "Sobre de 100g semillas",
        "Instrucciones de siembra",
        "Guía de cultivo"
      ]
    },
    {
      "id": 18,
      "nombre": "Bomba de Agua Solar 1HP",
      "precio": 1250000,
      "precioOriginal": 1450000,
      "images": [
        "https://www.ecozaque.com/wp-content/uploads/2021/02/HTB1oohwEeSSBuNjy0Flq6zBpVXaH.jpg",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Bomba de agua solar de 1HP, ideal para riego agrícola donde no hay acceso a red eléctrica convencional.",
      "caracteristicas": [
        "Energía solar",
        "1HP de potencia",
        "Bombea hasta 20m de altura",
        "Panel solar incluido",
        "Automática",
        "Bajo mantenimiento"
      ],
      "especificaciones": {
        "Potencia": "1 HP",
        "Caudal máximo": "5000 L/h",
        "Altura máxima": "20 m",
        "Panel solar": "800W incluido",
        "Voltaje": "24V DC",
        "Material": "Acero inoxidable"
      },
      "stock": 14,
      "rating": 4.8,
      "totalReviews": 29,
      "marca": "SolarWater",
      "sku": "SLW-PMP-1HP",
      "peso": "28 kg",
      "dimensiones": "60 x 40 x 30 cm",
      "garantia": "2 años",
      "incluye": [
        "Bomba solar",
        "Panel 800W",
        "Controlador",
        "Conexiones",
        "Manual instalación"
      ]
    },
    {
      "id": 19,
      "nombre": "Kit Análisis de Suelo Básico",
      "precio": 95000,
      "precioOriginal": 115000,
      "images": [
        "https://martinlishman.com/wp-content/uploads/Soil-Testing-Kit-Range-1.png",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1590622783539-bae63fec9a5e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622484125614-6fe370d4ef74?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Kit completo para análisis básico de suelo, mide pH, NPK y materia orgánica de forma sencilla y precisa.",
      "caracteristicas": [
        "Mide pH, N, P, K",
        "Incluye todos los reactivos",
        "Manual detallado",
        "Resultados en minutos",
        "Fácil de usar",
        "Precisión profesional"
      ],
      "especificaciones": {
        "Parámetros": "pH, N, P, K, MO",
        "Número de tests": "50 tests completos",
        "Tiempo prueba": "10-15 minutos",
        "Incluye": "Reactivos, instrumentos, manual",
        "Precisión": "±0.2 pH",
        "Almacenamiento": "Temperatura ambiente"
      },
      "stock": 38,
      "rating": 4.5,
      "totalReviews": 64,
      "marca": "LabSoil",
      "sku": "LBS-KIT-001",
      "peso": "2.5 kg",
      "dimensiones": "30 x 20 x 15 cm",
      "garantia": "6 meses",
      "incluye": [
        "Reactivos para 50 tests",
        "Instrumentos de medición",
        "Manual de uso",
        "Guía interpretación"
      ]
    },
    {
      "id": 20,
      "nombre": "Cercado Eléctrico Solar 500m",
      "precio": 850000,
      "precioOriginal": 950000,
      "images": [
        "https://www.indisect.com/wp-content/uploads/2021/09/Cerco-ganadero-solar-indisect.jpg",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1593483316242-27a8d6b7c1c3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1572981779307-1028981c51d6?w=800&h=600&fit=crop"
      ],
      "categoryId": 1,
      "descripcion": "Sistema de cercado eléctrico solar para 500 metros, ideal para protección de cultivos y control de animales.",
      "caracteristicas": [
        "Energía solar",
        "Alcance 500m",
        "Electrificador potente",
        "Bajo consumo",
        "Fácil instalación",
        "Bajo mantenimiento"
      ],
      "especificaciones": {
        "Longitud": "500 m",
        "Energía": "Solar 12V",
        "Voltaje": "8000V",
        "Postes": "50 incluidos",
        "Aisladores": "Incluidos",
        "Batería": "12V 7Ah"
      },
      "stock": 16,
      "rating": 4.7,
      "totalReviews": 41,
      "marca": "ElectricFence",
      "sku": "ELF-500-SOL",
      "peso": "35 kg",
      "dimensiones": "80 x 50 x 40 cm",
      "garantia": "2 años",
      "incluye": [
        "Electrificador solar",
        "Postes y aisladores",
        "Cable conductor",
        "Herramientas instalación",
        "Manual"
      ]
    }
  ];
// Exportar productos
module.exports = productos;