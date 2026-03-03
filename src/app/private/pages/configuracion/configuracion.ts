import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario-service';
import { ObtenerInformacionPersonalResponse } from '../../../core/models/Autorizacion/ObtenerInformacionPersonal/ObtenerInformacionPersonalResponse';
import { ObtenerFacultadResponse } from '../../../core/models/DatosMaestros/ObtenerFacultad/ObtenerFacultadResponse';
import { DatosMaestrosService } from '../../../core/services/datos-maestros-service';
import { forkJoin, map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AlertaServices } from '../../../core/services/alerta-services';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { Router } from '@angular/router';
import { ActualizarInformacionRequest } from '../../../core/models/Usuario/ActualizarInformacion/ActualizarInformacionRequest';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class Configuracion implements OnInit {
  userForm!: FormGroup;
  usuario: ObtenerInformacionPersonalResponse = {} as ObtenerInformacionPersonalResponse;
  facultades: ObtenerFacultadResponse[] = [];
  escuelas: ObtenerFacultadResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private datosMaestrosService: DatosMaestrosService,
    private alertService: AlertaServices,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      codigoUniversitario: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      nombreFacultad: ['', Validators.required],
      nombreEscuela: ['', Validators.required],
    });

    forkJoin({
      facultades: this.datosMaestrosService.ObtenerFacultad(),
      usuario: this.usuarioService.ObtenerInformacionPersonal()
    }).pipe(
      switchMap(({ facultades, usuario }) => {
        this.facultades = facultades;
        this.usuario = usuario;

        return this.datosMaestrosService.ObtenerEscuela(usuario.idFacultad).pipe(
          map(escuelas => ({ usuario, escuelas }))
        );
      })
    ).subscribe({
      next: ({ usuario, escuelas }) => {
        this.escuelas = escuelas;

        this.userForm = this.fb.group({
          codigoUniversitario: [usuario.codigoUniversitario],
          tipoDocumento: [usuario.tipoDocumento],
          numeroDocumento: [usuario.numeroDocumento],
          nombre: [usuario.nombre],
          apellidoPaterno: [usuario.apellidoPaterno],
          apellidoMaterno: [usuario.apellidoMaterno],
          correo: [{ value: usuario.correo, disabled: true }],
          telefono: [usuario.telefono],
          nombreFacultad: [usuario.idFacultad],
          nombreEscuela: [usuario.idEscuela],
        });
      },
      error: (err) => {
        console.error('Error cargando datos', err);
      }
    });
  }

  ObtenerEscuelasPorFacultad(event: Event) {
    const idFacultad = (event.target as HTMLSelectElement).value;
    this.datosMaestrosService.ObtenerEscuela(Number.parseInt(idFacultad)).subscribe(
      (response) => {
        this.escuelas = response;
      }
    )
  }

  ActualizarInformacion(): void {
    if (this.validarFormulario()) {
      var actualizarInformacion: ActualizarInformacionRequest = {
        idUsuario: this.usuario.id,
        codigoUniversitario: this.userForm.get('codigoUniversitario')?.value,
        tipoDocumento: this.userForm.get('tipoDocumento')?.value,
        numeroDocumento: this.userForm.get('numeroDocumento')?.value,
        nombre: this.userForm.get('nombre')?.value,
        apellidoPaterno: this.userForm.get('apellidoPaterno')?.value,
        apellidoMaterno: this.userForm.get('apellidoMaterno')?.value,
        telefono: this.userForm.get('telefono')?.value,
        idEscuela: this.userForm.get('nombreEscuela')?.value,
      }
      this.usuarioService.ActualizarInformacion(actualizarInformacion).subscribe(
        (response) => {
          if (response.mensaje == 'OK') {
            this.alertService.success('Información actualizada correctamente');
            const usuario = this.localStorageService.getItem('usuario');
            if (usuario.llenarPerfil) {
              this.router.navigate(['/']);
            }
          } else {
            this.alertService.error('No se pudo actualizar la información');
          }
        }
      );
    } else {
      this.alertService.error('No se pudo actualizar la información');
    }
  }

  validarFormulario() {
    return !(this.userForm.get('codigoUniversitario')?.value.length == 0 ||
      this.userForm.get('tipoDocumento')?.value == '' ||
      this.userForm.get('numeroDocumento')?.value.length == 0 ||
      this.userForm.get('nombre')?.value.length == 0 ||
      this.userForm.get('apellidoPaterno')?.value.length == 0 ||
      this.userForm.get('apellidoMaterno')?.value.length == 0 ||
      this.userForm.get('correo')?.value.length == 0 ||
      this.userForm.get('telefono')?.value.length == 0 ||
      this.userForm.get('nombreFacultad')?.value == '0' ||
      this.userForm.get('nombreEscuela')?.value == '0')
  }
}