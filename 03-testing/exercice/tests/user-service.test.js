import { describe, it, beforeEach, afterEach } from 'node:test'
import sinon from "sinon";
import { UserService } from '../src/user-service.js';
import * as assert from "node:assert";

describe('UserService', () => {
    let userService;
    let userRepositoryStub;
    let geoApiStub;

    beforeEach(() => {
        const userMock = { id: 1, name: "Ada", ip: "8.8.8.8" };

        userRepositoryStub = {
            findById: sinon.stub().resolves(userMock),
        };

        geoApiStub = {
            locate: sinon.stub().resolves({ country: "US" }),
        };

        userService = new UserService(userRepositoryStub, geoApiStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return correct user country', async () => {
        const user = await userService.getEnrichedUser(1);
        assert.strictEqual(user.country, "US");
    });

    it('should findById called once with param', async () => {
        await userService.getEnrichedUser(1);
        sinon.assert.calledOnceWith(userRepositoryStub.findById, 1);
    });

    it('should geo locate called once with param', async () => {
        await userService.getEnrichedUser(1);
        sinon.assert.calledOnceWith(geoApiStub.locate, "8.8.8.8");
    });

    it('should throw correct error if findById resolves null and dont call geoApi', async () => {
        userRepositoryStub.findById.resolves(null);

        await assert.rejects(
            userService.getEnrichedUser(99),
            /USER_NOT_FOUND/
        );

        sinon.assert.notCalled(geoApiStub.locate);
    });
});