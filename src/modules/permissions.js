exports[0] = () => true;
exports[1] = (client, member) => client.getMainMember(member.id).roles.has(client.mainRoles.employee.id);
exports[4] = (client, member) => client.auth.botOwners.includes(member.id);
