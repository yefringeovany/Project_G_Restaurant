import { Component, OnInit } from '@angular/core';

interface RestaurantInfo {
  name: string;
  description: string;
  locations: { address: string; phone: string }[];
  history: string;
  testimonials: { customer: string; comment: string }[];
  events: { title: string; description: string }[];
  socialMedia: { facebook: string; instagram: string; tiktok: string };
}

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.scss']
})
export class InformacionComponent implements OnInit {
  restaurantInfo: RestaurantInfo = {
    name: 'Restaurante Luna Café',
    description: 'Luna Café es un restaurante 100% pinulteco que celebra lo mejor de nuestra gastronomía local, ofreciendo platillos tradicionales preparados con ingredientes frescos de la región.',
    locations: [
      { address: 'San Pedro Pinula, Jalapa, Guatemala', phone: '(502) 7922 1116' }
    ],
    history: 'Luna Café comenzó como un pequeño café en el corazón de San Pedro Pinula. Desde nuestros humildes comienzos, hemos crecido y nos hemos establecido como un lugar destacado para disfrutar de la auténtica comida pinulteca. Nuestro compromiso con la calidad y la tradición ha sido siempre el corazón de nuestro éxito.',
    testimonials: [
      { customer: 'Cliente Satisfecho', comment: 'La comida es excelente y el ambiente es acogedor. Sin duda, uno de los mejores lugares en San Pedro Pinula.' },
      { customer: 'Otro Cliente Feliz', comment: 'Siempre disfruto de su atención al detalle y la calidad de sus platos. ¡Altamente recomendado!' }
    ],
    events: [
      { title: 'Reservacion del restaurante', description: 'Puedes reservar nuestro restaurante para cualquier tipo de evento de tu necesidad' },
      { title: 'Platillos Bajo Pedidos', description: 'Haznos saber que platillos necesitas, nosotros te los preparamos para cualquier ocacion' }
    ],
    socialMedia: {
      facebook: 'https://www.facebook.com/profile.php?id=100070787351863',
      instagram: 'https://www.instagram.com/luna_cafe502/',
      tiktok: 'https://www.tiktok.com/@luna_cafe502?_t=8pdc28kRMLF&_r=1'
    }
  };

  constructor() { }

  ngOnInit(): void {
  }
}
