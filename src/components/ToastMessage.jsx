import { useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function ToastMessage() {
  const { id, text, title, icon } = useSelector((state) => state.message);

  useEffect(() => {
    if (!id) return;

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      background: '#1f1f1f',
      color: '#ffffff',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: icon, 
      title: title, 
      text: text, 
    });

  }, [id, icon, title, text]);

  return <></>;
}