import React, { useState } from "react";
import { Navigation, ExternalLink } from "lucide-react";
import { brandConfig } from "../utils/brandConfig";

const StoreLocationMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Información de la tienda
  const storeInfo = {
    name: brandConfig.name,
    address: brandConfig.contact.address,
    city: brandConfig.contact.city
  };

  // URL para abrir en Google Maps app/web
  const directionsUrl = brandConfig.map.directionsUrl;
  const googleMapsUrl = brandConfig.map.embedUrl;

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank');
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Visita Nuestra <span className="text-green-600">Tienda</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Te esperamos en nuestra ubicación física para brindarte la mejor atención personalizada
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Mapa */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="aspect-w-16 aspect-h-12 relative h-96 lg:h-[500px]">
              {!mapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando mapa...</p>
                  </div>
                </div>
              )}
              
              {/* Mapa interactivo - Reemplaza la URL con coordenadas reales */}
              <iframe
                src={googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                onLoad={() => setMapLoaded(true)}
                title="Ubicación de la tienda AgroMarket"
              />
            </div>
          </div>

          {/* Marcador personalizado overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-800">
                {storeInfo.name}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de direcciones */}
        <div className="text-center mb-8">
          <button
            onClick={handleGetDirections}
            className="cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Navigation className="h-5 w-5 mr-2" />
            Cómo llegar
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoreLocationMap;