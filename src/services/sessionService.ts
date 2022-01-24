import { getRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import SessionEntity from '../entities/SessionEntity';

async function createNewSession(userId: number): Promise<string> {
    const previousSession = await getRepository(SessionEntity).findOne({
        user: {
            id: userId,
        },
    });

    if (previousSession) return previousSession.token;

    const token = uuid();
    const newSession = getRepository(SessionEntity).create({
        user: {
            id: userId,
        },
        token,
    });

    await getRepository(SessionEntity).save(newSession);

    return token;
}

async function findSession(token: string): Promise<SessionEntity> {
    const session = await getRepository(SessionEntity).findOne({ token });

    return session;
}

export {
    createNewSession,
    findSession,
};
