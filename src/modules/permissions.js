class Permissions extends Array {}
const permissions = new Permissions;
permissions[0] = () => true;
permissions[1] = (client, member) => client.getMainMember(member.id) ? client.getMainMember(member.id).roles.has(client.mainRoles.employee.id) : false;
permissions[2] = (client, member) => member.permissions.has("MANAGE_GUILD");
permissions[3] = (client, member) => client.getMainMember(member.id) ? client.getMainMember(member.id).permissions.has("MANAGE_MESSAGES") : false;
permissions[4] = (client, member) => client.auth.botOwners.includes(member.id);
module.exports = permissions;
