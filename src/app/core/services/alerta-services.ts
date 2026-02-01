import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaServices {
  private fire(
    title: string,
    text: string,
    icon: SweetAlertIcon
  ) {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar'
    });
  }

  success(message: string, title = 'Éxito') {
    this.fire(title, message, 'success');
  }

  error(message: string, title = 'Error') {
    this.fire(title, message, 'error');
  }

  warning(message: string, title = 'Advertencia') {
    this.fire(title, message, 'warning');
  }

  info(message: string, title = 'Información') {
    this.fire(title, message, 'info');
  }

  confirm(
    message: string,
    onConfirm: () => void,
    title = '¿Estás seguro?'
  ) {
    Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  loading(message = 'Procesando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }

  private toast(icon: SweetAlertIcon, message: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  toastSuccess(message: string) {
    this.toast('success', message);
  }

  toastError(message: string) {
    this.toast('error', message);
  }
}
