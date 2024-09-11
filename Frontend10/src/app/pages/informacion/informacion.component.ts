import { Component, OnInit } from '@angular/core';

interface RestaurantInfo {
  name: string;
  description: string;
  locations: { address: string; phone: string }[];
  promotions: { title: string; description: string }[];
  website: string;
  socialMedia: { facebook: string; instagram: string; twitter: string };
}

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.scss']
})
export class InformacionComponent implements OnInit {
  restaurantInfo: RestaurantInfo = {
    name: 'La Delicia',
    description: 'La Delicia es un restaurante familiar que ofrece la mejor comida tradicional con un toque moderno.',
    locations: [
      { address: 'Calle Principal 123, Ciudad Ejemplo, País', phone: '+1 234 567 8900' },
      { address: 'Avenida Secundaria 456, Ciudad Ejemplo, País', phone: '+1 098 765 4321' }
    ],
    promotions: [
      { title: 'Martes de Tacos', description: '2x1 en todos nuestros tacos cada martes' },
      { title: 'Happy Hour', description: 'Bebidas al 50% de descuento de 5pm a 7pm' }
    ],
    website: 'www.ladelicia.com',
    socialMedia: {
      facebook: 'facebook.com/ladelicia',
      instagram: 'instagram.com/ladelicia',
      twitter: 'twitter.com/ladelicia'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }
}
