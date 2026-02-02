import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { Layout } from "./pages/layout/layout";
import { authorizeGuard } from "../core/guards/authorize.Guard";
import { GestionPermisos } from "./pages/gestion-permisos/gestion-permisos";
import { RevisionProyecto } from "./pages/revision-proyecto/revision-proyecto";
import { GestionProyectos } from "./pages/gestion-proyectos/gestion-proyectos";
import { Configuracion } from "./pages/configuracion/configuracion";
import { MensajeBase } from "./pages/mensaje-base/mensaje-base";

const routes: Routes = [
    {
        path: '',
        component: Layout,
        // canActivateChild: [authorizeGuard],
        children: [
            {
                path: '',
                component: MensajeBase,
                canActivate: [authorizeGuard],
            },
            {
                path: 'gestionpermisos',
                component: GestionPermisos,
                canActivate: [authorizeGuard]
            },
            {
                path: 'revisionproyectos',
                component: RevisionProyecto,
                canActivate: [authorizeGuard]
            },
            {
                path: 'gestionproyectos',
                component: GestionProyectos,
                canActivate: [authorizeGuard]
            },
            {
                path: 'configuracion',
                component: Configuracion
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PrivateRoutingModule { }