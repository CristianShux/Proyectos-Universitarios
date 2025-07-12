import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface Usuario {
  access_token: string;
  token_type: "bearer";
  permisos: {
    ver_datos_personales: boolean;
    editar_datos_personales: boolean;
    ver_datos_empleado: boolean;
    editar_datos_empleado: boolean;
    ver_datos_empresa: boolean;
    editar_datos_empresa: boolean;
  };
  rol: "1" | "2" | "3" | "4"; // 1: empleado, 2: administrador, 3: supervisor, 4: analista-datos
  id_empleado: number;
  numero_identificacion: string;
  id_usuario: string; 
}

interface UserContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Inicializas leyendo el sessionStorage
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const token = sessionStorage.getItem("token");
    const usuarioStr = sessionStorage.getItem("usuario");
    if (token && usuarioStr) {
      const parsed = JSON.parse(usuarioStr);
      return {
        access_token: token,
        token_type: "bearer",
        permisos: parsed.permisos,
        rol: parsed.rol,
        id_empleado: parsed.id_empleado,
        numero_identificacion: parsed.numero_identificacion,
        id_usuario: sessionStorage.getItem("id_usuario") || ""
      };
    }
    return null;
  });
  // Siempre que cambie `usuario`, sincronizamos el sessionStorage
  useEffect(() => {
    if (usuario) {
      sessionStorage.setItem("token", usuario.access_token);
      sessionStorage.setItem("id_usuario", usuario.id_usuario);
      sessionStorage.setItem(
        "usuario",
        JSON.stringify({
          permisos: usuario.permisos,
          rol: usuario.rol,
          id_empleado: usuario.id_empleado,
          numero_identificacion: usuario.numero_identificacion,
        })
      );
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("usuario");
    }
  }, [usuario]);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
