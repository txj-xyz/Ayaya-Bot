module.exports = {
    async checkUser(guild, user) {
        const member = guild.members.cache.get(user.id);
        let mixerRole = await guild.roles.cache.find(role => role.name === "🎵 Mixer 🎵");

        if (member.hasPermission(`ADMINISTRATOR`) || member.roles.cache.has(mixerRole.id)) {
            return true;
        }
        else {
            return false;
        }
    }
};