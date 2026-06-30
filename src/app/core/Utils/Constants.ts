export class Constantes {

  static getEstadoProyecto(estado: string): string {
    const estados: Record<string, string> = {
      P: 'Pendiente de Aprobación',
      T: 'Pendiente de Cotesista',
      A: 'Aprobado',
      R: 'Rechazado',
      F: 'Finalizado',
      C: 'Cancelado'
    };

    return estados[estado] || 'Desconocido';
  }

  static getClaseEstado(estado: string): string {
    const clases: Record<string, string> = {
      P: 'bg-amber-100 text-amber-800',
      T: 'bg-amber-100 text-amber-800',
      A: 'bg-green-100 text-green-800',
      R: 'bg-red-100 text-red-800',
      F: 'bg-blue-100 text-blue-800',
      C: 'bg-gray-100 text-gray-800'
    };

    return clases[estado] || 'bg-gray-100 text-gray-800';
  }
}
