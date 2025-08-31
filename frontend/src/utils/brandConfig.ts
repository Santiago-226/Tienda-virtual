export const brandConfig = {
    // INFORMACIÓN BÁSICA DE LA MARCA
    name: 'AgroTienda',           // Reemplazar con tu nombre
    slogan: 'Tu aliado en cada siembra',         // Reemplazar con tu slogan
    
    // LOGO E IMÁGENES
    logo: {
      icon: '🛍️',                     // Emoji temporal (puedes cambiarlo)
      url: '/logo.png',               // Si tienes logo, poner ruta aquí
      alt: 'TU_NOMBRE_AQUÍ Logo'      // Texto alternativo
    },
    
    // INFORMACIÓN DE CONTACTO
    contact: {
      email: 'info@tunombre.com',     // Tu email (real o simulado)
      phone: '+1 (555) 123-4567',     // Tu teléfono (real o simulado)
      whatsapp: '+1555123467',        // WhatsApp sin espacios ni símbolos
      city: 'Gigante',
      departamento: 'Huila',
      pais: 'Colombia',
      address: 'Carrera 10 No. 11 - 22', // Dirección física
      horario: {
        lunes: '8:00 AM - 6:00 PM',
        sabado: '9:00 AM - 2:00 PM'
      }
    },
    
    //Mapa
    map:{
      directionsUrl:`https://www.google.com/maps/place/SENA+-+GARZON/@2.1998822,-75.6263918,17z/data=!3m1!4b1!4m6!3m5!1s0x8e24d985e72b920f:0x47ae9b5b47ce6850!8m2!3d2.1998822!4d-75.6263918!16s%2Fg%2F1tdr9741?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D`,
      embedUrl:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8778056236165!2d-75.6263918!3d2.1998822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e24d985e72b920f%3A0x47ae9b5b47ce6850!2sSENA%20-%20GARZON!5e0!3m2!1ses-419!2sco!4v1756658761155!5m2!1ses-419!2sco`
    },
    // REDES SOCIALES
    social: {
      facebook: 'https://www.facebook.com/santiago.sanchezramos.7106/',
      instagram: 'https://instagram.com/tunombre',
      twitter: 'https://twitter.com/tunombre',
      youtube: 'https://youtube.com/tunombre',
      linkedin: 'https://linkedin.com/company/tunombre'
    },
    
    // INFORMACIÓN EMPRESARIAL
    company: {
      foundedYear: 2024,
      description: 'Proveedores líderes de productos agrícolas de alta calidad en Colombia. Ofrecemos semillas certificadas, fertilizantes orgánicos y herramientas profesionales.',
      mission: 'Brindar soluciones agrícolas innovadoras y sostenibles que impulsen la productividad y el bienestar de nuestros clientes.',
      vision: 'Ser la empresa de referencia en el sector agrícola, reconocida por su compromiso con la calidad, la sostenibilidad y la satisfacción del cliente.',
      values: [
        'Calidad excepcional',
        'Servicio al cliente',
        'Innovación constante'
      ]
    },
    
    // CONFIGURACIÓN DE NEGOCIO
    business: {
      currency: 'USD',
      freeShippingThreshold: 100,     // Envío gratis desde este monto
      returnDays: 30,                 // Días para devoluciones
      warrantyYears: 2,               // Años de garantía
      supportHours: 'Lun - Vie: 9AM - 6PM'
    }
  };