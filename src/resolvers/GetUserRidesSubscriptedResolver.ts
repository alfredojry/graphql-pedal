import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Subscription, Subscription as SubscriptionObjType } from "../models/Subscription";

@Resolver()
class GetUserRidesSubscriptedResolver {
    
    @Query(returns => [Subscription], {
        nullable: true,
        description: 'Consulta de pedais nos quais o usuário está inscrito',
    })
    async getUserRidesSubscripted(
        @Ctx() { prisma: { user }, userId }: Context,
    ) {
        if (!userId) throw new Error('User must login first');
        const currUser = await user.findUnique({
            where: { id: userId.userId },
            select: { subscriptions: true },
        });
        const { subscriptions } = currUser;
        return subscriptions;
    }
}

export { GetUserRidesSubscriptedResolver };