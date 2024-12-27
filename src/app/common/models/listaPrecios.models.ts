export interface ListaPrecios {
  id?: string;
  nombreComercio: string;
  productos: Producto[];
  fechaCreacion?: Date;
}

export interface Producto {
  nombre: string;
  descripcion: string;
  precio: number;
}
