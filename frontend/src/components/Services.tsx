import React from "react";
import { Leaf, Truck, Users, Shield, Phone } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Semillas Certificadas",
      description: "Semillas de alta calidad certificadas para garantizar la mejor germinación y productividad en tus cultivos.",
      features: ["Certificación INIA", "Alta germinación", "Variedades mejoradas", "Resistentes a plagas"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Fertilizantes Orgánicos",
      description: "Nutrición completa para tus plantas con fertilizantes orgánicos que cuidan el suelo y el medio ambiente.",
      features: ["100% naturales", "Liberación lenta", "Mejora del suelo", "Sin químicos tóxicos"]
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Herramientas Agrícolas",
      description: "Equipos y herramientas profesionales para facilitar tu trabajo en el campo con máxima eficiencia.",
      features: ["Calidad profesional", "Durabilidad garantizada", "Ergonómicas", "Mantenimiento incluido"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Asesoría Técnica",
      description: "Acompañamiento personalizado de nuestros ingenieros agrónomos en todas las etapas de tu cultivo.",
      features: ["Consulta gratuita", "Visitas a campo", "Planes personalizados", "Soporte 24/7"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Nuestros <span className="text-green-600">Servicios</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones integrales para el sector agrícola con productos de la más alta calidad 
            y el respaldo de expertos en agronomía.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Servicios principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-green-200"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {service.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              ¿Necesitas Asesoría Personalizada?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Nuestros expertos están listos para ayudarte a elegir los mejores productos 
              para tu proyecto agrícola.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cursor-pointer bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contactar Ahora</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;