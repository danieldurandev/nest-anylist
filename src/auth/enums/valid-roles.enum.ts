import { registerEnumType } from "@nestjs/graphql";

export enum validRoles {
    admin = "admin",
    user = "user",
    superUser = "superUser"
}

registerEnumType(validRoles, {name: "ValidRoles", description: "Roles de usuarios"})
