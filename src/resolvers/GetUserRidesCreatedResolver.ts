import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Ride } from "../models/Ride";

@Resolver()
class GetUserRidesCreatedResolver {
    
    @Query(returns => [Ride], {
        description: 'Consulta de pedais creados pelo usuário', 
        nullable: true,
    })
    async getUserRidesCreated(
        @Ctx() { prisma: { user }, userId }: Context,
    ) {
        if (!userId) throw new Error('User must login first');
        const currUser = await user.findUnique({
            where: { id: userId.userId },
            select: { rides_created: true },
        });
        const { rides_created } = currUser;
        return rides_created;
    }
}

export { GetUserRidesCreatedResolver };