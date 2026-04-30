import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  public isLoading = this.loading.asObservable();

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }
}
