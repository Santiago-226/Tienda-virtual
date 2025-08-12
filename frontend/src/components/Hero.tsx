import React from "react";
import heroImage from "../assets/images/heroImage.jpeg";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white py-20 px-6 pt-24 md:pt-28 relative overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Cultiva el Futuro con
              <span className="text-yellow-300"> Productos Agrícolas</span>
              <br />
              <span className="text-green-200">de Calidad</span>
            </h1>

            <p className="text-xl mb-8 text-green-100">
              En{" "}
              <span className="font-semibold text-yellow-300">AgroTienda</span>{" "}
              ofrecemos los mejores productos agrícolas, semillas, fertilizantes
              y herramientas para que tu cosecha sea exitosa y sostenible.
            </p>

            {/* Estadísticas agrícolas */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-sm text-green-200">Productos</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-green-200">Satisfacción</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">15+</div>
                <div className="text-sm text-green-200">Años</div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-yellow-400 text-green-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl">
                Ver Catálogo
              </button>
              <button className="border-2 border-green-200 text-green-100 px-8 py-3 rounded-lg font-bold hover:bg-green-200 hover:text-green-900 transition-all duration-200">
                Asesoría Gratuita
              </button>
            </div>
          </div>

          {/* Sección de imagen */}
          <div className="text-center relative">
            <div className="relative">
              {/* Imagen principal */}
              <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center border-4 border-green-200/30 shadow-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Productos agrícolas"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Elementos flotantes */}
              <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center animate-bounce shadow-lg">
                <span className="text-2xl">🌱</span>
              </div>

              <div className="absolute bottom-10 right-10 w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center animate-pulse shadow-lg">
                <span className="text-2xl">🚜</span>
              </div>

              <div className="absolute top-20 right-20 w-12 h-12 bg-red-400 rounded-full flex items-center justify-center animate-bounce delay-75 shadow-lg">
                <span className="text-lg">🍅</span>
              </div>

              <div className="absolute bottom-20 left-20 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center animate-pulse delay-100 shadow-lg">
                <span className="text-lg">🌿</span>
              </div>
            </div>

            {/* Elementos decorativos adicionales */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-300 rounded-full opacity-60 animate-ping delay-200"></div>
          </div>
        </div>

        {/* Sección de características destacadas */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-200/20">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">
              Productos Orgánicos
            </h3>
            <p className="text-green-200">
              Semillas y fertilizantes 100% naturales para un cultivo sostenible
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-200/20">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">
              Envío Gratuito
            </h3>
            <p className="text-green-200">
              Entrega rápida y segura en compras superiores a $50.000
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-green-200/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-green-100 mb-2">
              Asesoría Experta
            </h3>
            <p className="text-green-200">
              Nuestros agrónomos te acompañan en cada paso del proceso
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;