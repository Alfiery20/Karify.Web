import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { LocalStorageService } from "../../services/local-storage-service";
import { constants } from "./Contants";

export class Api {
    protected http: HttpClient = inject(HttpClient);

    protected localStorageService = inject(LocalStorageService);

    protected url = constants.apiUrl;
    protected tokenName = constants.tokenName;

    protected get _headers() {
        const token = this.localStorageService.getItem(this.tokenName);
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
}
