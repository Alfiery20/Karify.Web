export class Constantes {

  static getEstadoProyecto(estado: string): string {
    const estados: Record<string, string> = {
      P: 'Pendiente de Aprobación',
      A: 'Aprobado',
      R: 'Rechazado',
      F: 'Finalizado',
      C: 'Cancelado'
    };

    return estados[estado] || 'Desconocido';
  }
}
