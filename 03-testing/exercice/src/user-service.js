export class UserService {
    constructor(userRepository, geoApi) {
        this.userRepository = userRepository;
        this.geoApi = geoApi;
    }

    async getEnrichedUser(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        const location = await this.geoApi.locate(user.ip);
        return { ...user, country: location.country };
    }
}