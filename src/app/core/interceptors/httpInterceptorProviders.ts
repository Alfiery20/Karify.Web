import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoaderInterceptor } from "./LoaderInterceptor";
import { AuthInterceptor } from "./AuthInterceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
]
