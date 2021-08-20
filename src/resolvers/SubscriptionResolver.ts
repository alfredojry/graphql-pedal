import { Args, ArgsType, Ctx, Field, Int, Mutation, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Subscription as SubscriptionObjType } from "../models/Subscription";


@ArgsType()
class SubscriptionArgs {
    @Field(type => Int)
    ride_id!: number;
    @Field(type => Int)
    user_id!: number;
    @Field()
    subscription_date!: Date;
}

@Resolver()
class SubscriptionResolver {

    @Mutation(returns => SubscriptionObjType, { description: 'Inscrição de usuário em um pedal' })
    async subscribe(
        @Args() args: SubscriptionArgs,
        @Ctx() { prisma: { ride, subscription }, userId }: Context,
    ) {
        if (!userId) throw new Error('No such user found');
        //if (userId.id !== args.user_id) throw new Error('Subscriptions each other forbidden');
        const timestamp_subscription = args.subscription_date.getTime();
        if ( isNaN( timestamp_subscription ) ) {
            throw new Error('String data format invalid');
        }
        const currRide = await ride.findUnique({
            where: {
                id: args.ride_id,
            },
        });
        if (!currRide) throw new Error('Not matches in ride ID');
        // Não permitir inscripção em pedais depois da última data de inscripção
        if (timestamp_subscription > Date.now()) {
            throw new Error('Subscription out time forbidden!');
        }
        // Evitar que o usuário faça mais de uma inscrição no mesmo pedal
        const searchSameRide = await subscription.findMany({
            where: { user_id: userId.userId },
        });
        if (searchSameRide) throw new Error('Only one subscription per user in a ride');
        const newSubscription = await subscription.create({
            data: {
                ride: { connect: { id: currRide.id } },
                user: { connect: { id: userId.userId } },
                subscription_date: args.subscription_date,
            }
        });
        return newSubscription;
    }
}

export { SubscriptionResolver };