import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertaServices } from '../services/alerta-services';

@Injectable({
    providedIn: 'root',
})
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: AlertaServices) { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        this.showLoader();
        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.onEnd();
                    }
                },
                (err: any) => {
                    this.onEnd();
                }
            )
        );
    }
    private onEnd(): void {
        setTimeout(() => {
            this.hideLoader();
        }, 500);
    }
    private showLoader(): void {
        this.loaderService.loading();
    }
    private hideLoader(): void {
        this.loaderService.close();
    }
}
