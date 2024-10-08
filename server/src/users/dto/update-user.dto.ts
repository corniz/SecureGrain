export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRoles;
  phoneNumber?: string;
  warehouseId?: number; 
}
enum UserRoles {
  Client = "Client",
  Manager = "Manager",
  Admin = "Admin"
}