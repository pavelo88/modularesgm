import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Modulares GM | Cocinas y Diseño',
    short_name: 'ModularesGM',
    description: 'Expertos en cocinas modulares, mobiliario de oficina, góndolas y remodelación integral en Ecuador.',
    start_url: '/',
    display: 'standalone',
    background_color: '#19242D',
    theme_color: '#2C5F6D',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
