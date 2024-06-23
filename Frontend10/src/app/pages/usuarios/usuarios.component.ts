import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "./usuarios.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  contrasenia: string;
  rol: string;
  usuarioCreado: boolean = false;
  usuarioActualizado: boolean = false;
  usuarios: any[];
  formularioUsuario: boolean = false;
  botonCrearNuevoUsuario: boolean = true;
  tablaUsuarios: boolean = true;
  idUsuarioEditar: number | null = null;

  constructor(private usuarioService: UsuariosService) {
  }

  ngOnInit(): void {
    this.listadoUsuarios();
  }

  registroUsuarios(nombre: string, apellido: string, correo_electronico: string, contrasenia: string, rol: string) {
    if (this.idUsuarioEditar !== null) {
      this.actualizarUsuario(this.idUsuarioEditar, nombre, apellido, correo_electronico, contrasenia, rol);
      this.limpiarCampos();
      this.ocultarAlerta();
    } else {
      this.usuarioService.registroUsuarios(nombre, apellido, correo_electronico, contrasenia, rol).subscribe(
        () => {
          this.usuarioCreado = true;
          this.limpiarCampos();
          this.ocultarAlerta()
        },
        (error) => {
          console.error('Error en el registro del usuario:', error);
        }
      )
    }
  }

  actualizarUsuario(id: number, nombre: string, apellido: string, correo_electronico: string, contrasenia: string, rol: string) {
    this.usuarioService.actualizarUsuario(id, nombre, apellido, correo_electronico, contrasenia, rol).subscribe(
      () => {
        this.usuarioActualizado = true;
        this.listadoUsuarios();
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe(
        () => {
          this.listadoUsuarios();
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }

  listadoUsuarios() {
    this.usuarioService.listadoUsuarios().subscribe(
      (response) => {
        this.usuarios = response;
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  limpiarCampos() {
    this.nombre = '';
    this.apellido = '';
    this.correo_electronico = '';
    this.contrasenia = '';
    this.rol = '';
  }

  ocultarAlerta() {
    setTimeout(() => {
      this.usuarioCreado = false;
      this.usuarioActualizado = false;
      this.formularioUsuario = false;
      this.botonCrearNuevoUsuario = true;
      this.tablaUsuarios = true;
      this.listadoUsuarios();
    }, 5000);
  }

  editarUsuario(usuario: any) {
    this.idUsuarioEditar = usuario.id;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.correo_electronico = usuario.correo_electronico;
    this.contrasenia = usuario.contrasenia;
    this.rol = usuario.rol;
    this.formularioUsuario = true;
    this.botonCrearNuevoUsuario = false;
    this.tablaUsuarios = false;
  }

  cancelarEdicion() {
    this.idUsuarioEditar = null;
    this.limpiarCampos();
    this.formularioUsuario = false;
    this.botonCrearNuevoUsuario = true;
    this.tablaUsuarios = true;
  }
}
