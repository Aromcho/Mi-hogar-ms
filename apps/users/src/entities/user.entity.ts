export class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    address?: string;
    logo?: string;
    role?: string;
    branchId?: string; // Relación con la sucursal
    favorites?: string[]; // Relación con propiedades favoritas
  }
  