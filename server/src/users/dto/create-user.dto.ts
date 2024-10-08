enum UserRoles {
  Client = "Client",
  Manager = "Manager",
  Admin = "Admin"
}
export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Assuming this will be hashed before storing
  role?: UserRoles;
  phoneNumber: string;
}