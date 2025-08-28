import React from "react";
import { Award, Users, Leaf, Target, Heart} from "lucide-react";
import Services from "../components/Services";

const AboutUs = () => {
  const stats = [
    { number: "15+", label: "Años de Experiencia", icon: <Award className="h-8 w-8" /> },
    { number: "5000+", label: "Agricultores Satisfechos", icon: <Users className="h-8 w-8" /> },
    { number: "500+", label: "Productos Disponibles", icon: <Leaf className="h-8 w-8" /> },
    { number: "98%", label: "Índice de Satisfacción", icon: <Target className="h-8 w-8" /> }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Compromiso",
      description: "Nos comprometemos con el éxito de cada agricultor, brindando productos y servicios de la más alta calidad."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sostenibilidad",
      description: "Promovemos prácticas agrícolas sostenibles que cuiden el medio ambiente para las futuras generaciones."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Comunidad",
      description: "Trabajamos junto a los agricultores, construyendo relaciones duraderas basadas en la confianza mutua."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div>
        <Services />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Conoce Nuestra <span className="text-green-600">Historia</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desde 2008, hemos sido el aliado confiable de miles de agricultores en Colombia, 
            proporcionando productos agrícolas de calidad superior y asesoría especializada.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-yellow-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Nuestra Historia */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              15 Años Cultivando <span className="text-green-600">Confianza</span>
            </h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-green-600">AgroTienda</strong> nació en 2008 con la visión de revolucionar 
                el sector agrícola colombiano, ofreciendo productos de calidad superior y asesoría especializada 
                a agricultores de todo el país.
              </p>
              <p>
                Iniciamos como una pequeña empresa familiar en Bogotá, y gracias al compromiso con nuestros 
                clientes y la innovación constante, hemos crecido hasta convertirnos en una de las empresas 
                líderes del sector agrícola en Colombia.
              </p>
              <p>
                Hoy, con más de 15 años de experiencia, continuamos expandiendo nuestra cobertura y mejorando 
                nuestros servicios para seguir siendo el aliado confiable que cada agricultor necesita.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Campo agrícola"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl">
              15+<br/><span className="text-sm font-normal">años</span>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-gradient-to-br from-green-50 to-gray-50 rounded-3xl p-8 md:p-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Nuestros <span className="text-green-600">Valores</span>
            </h3>
            <p className="text-xl text-gray-600">
              Los principios que guían cada una de nuestras acciones
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {value.icon}
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;