import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

// Función para llamar a SweetAlert2
export function showAlert({ status, message }) {
  const title = status ? '¡Éxito!' : 'Lo sentimos'
  const icon = status ? 'success' : 'error'
  Swal.fire({
    title,
    text: message,
    icon
  })
}

export function fireToast({ icon, title, timer = 3500 }) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    }
  })
  Toast.fire({ icon, title })
}


export function confirmAction({ title, text }) {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
  });
}

export function confirmToastAction({ title }) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Sí, confirmar',
    cancelButtonText: 'Cancelar',
    timer: 10000,
    timerProgressBar: true,
  });

  return Toast.fire({
    icon: 'warning',
    title,
  });
}