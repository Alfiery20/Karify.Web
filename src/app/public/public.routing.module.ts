import { RouterModule, Routes } from "@angular/router";
import { InicioSesion } from "./pages/inicio-sesion/inicio-sesion";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '',
        component: InicioSesion,
        children: []
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PublicRoutingModule { }