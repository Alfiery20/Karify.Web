import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario-service';
import { ObtenerInformacionPersonalResponse } from '../../../core/models/Autorizacion/ObtenerInformacionPersonal/ObtenerInformacionPersonalResponse';
import { ObtenerFacultadResponse } from '../../../core/models/DatosMaestros/ObtenerFacultad/ObtenerFacultadResponse';
import { DatosMaestrosService } from '../../../core/services/datos-maestros-service';
import { forkJoin, map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

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
    private datosMaestrosService: DatosMaestrosService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      codigoUniversitario: [''],
      tipoDocumento: [''],
      numeroDocumento: [''],
      nombre: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      correo: [''],
      telefono: [''],
      idFacultad: [''],
      idEscuela: [''],
      nombreFacultad: [''],
      nombreEscuela: [''],
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

        // 3. Inicializar formulario
        this.userForm = this.fb.group({
          codigoUniversitario: [usuario.codigoUniversitario],
          tipoDocumento: [usuario.tipoDocumento],
          numeroDocumento: [usuario.numeroDocumento],
          nombre: [usuario.nombre],
          apellidoPaterno: [usuario.apellidoPaterno],
          apellidoMaterno: [usuario.apellidoMaterno],
          correo: [{ value: usuario.correo, disabled: true }],
          telefono: [usuario.telefono],
          idFacultad: [usuario.idFacultad],
          idEscuela: [usuario.idEscuela],
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

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Datos actualizados:', this.userForm.value);
      // Aquí puedes llamar a tu servicio para enviar la info al backend
    } else {
      console.log('Formulario inválido');
    }
  }
}