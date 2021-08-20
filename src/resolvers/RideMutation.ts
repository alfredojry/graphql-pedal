import { Args, ArgsType, Ctx, Field, Int, Mutation, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Ride } from "../models/Ride";

const participants_limit_default = 0;

@ArgsType()
class GetRideArgs {
    @Field()
    name!: string;
    @Field()
    start_date!: Date;
    @Field()
    start_date_registration!: Date;
    @Field()
    end_date_registration!: Date;
    @Field({ nullable: true })
    additional_information?: string;
    @Field()
    start_place!: string;
    @Field(type => Int, { nullable: true })
    participants_limit?: number;
}

@Resolver()
class RideMutation {

    @Mutation(returns => Ride)
    async newRide(
        @Args() args: GetRideArgs,
        @Ctx() { prisma: { ride }, userId }: Context
    ) {
        if (!userId) throw new Error('User must login first');
        const newR = await ride.create({
            data: {
                ...args,
                additional_information: args.additional_information || '',
                participants_limit: args.participants_limit || participants_limit_default,
                created_by: { connect: { id: userId.userId } },
            }
        });
        return newR;
    }
}

export { RideMutation };