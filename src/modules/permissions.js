class Permissions extends Array {}
permissions[0] = () => true;
permissions[1] = (client, member) => client.getMainMember(member.id).roles.has(client.mainRoles.employee.id);
permissions[2] = () => false;
permissions[3] = () => false;
permissions[4] = (client, member) => client.auth.botOwners.includes(member.id);
module.exports = permissions
