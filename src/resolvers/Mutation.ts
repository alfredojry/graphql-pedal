import { Args, ArgsType, Ctx, Field, Int, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Ride } from "../models/Ride";
import { User } from "../models/User";
import { Subscription, Subscription as SubscriptionObjType } from "../models/Subscription";
import { AuthPayload } from "../models/AuthPayload";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../utils";

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
    @Field()
    additional_information?: string;
    @Field()
    start_place!: string;
    @Field(type => Int)
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
                participants_limit: args.participants_limit || 0,
                created_by: { connect: { id: userId.userId } },
            }
        });
        return newR;
    }
}

@ArgsType()
class getSignupArgs {
    @Field()
    name!: string;
    @Field()
    email!: string;
    @Field()
    password!: string;
}

@Resolver()
class SignupResolver {

    @Mutation(returns => AuthPayload)
    async signup(
        @Args() { name, email, password }: getSignupArgs,
        @Ctx() { prisma: { user } }: Context
    ) {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            data: {
                name,
                email,
                password: passwordHash,
            }
        });
        const token = jwt.sign({ userId: newUser.id }, APP_SECRET);
        return {token, newUser};
    }
}

@Resolver()
class GetUserRidesSubscriptedResolver {
    
    @Query(returns => [Subscription], { nullable: true })
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

@Resolver()
class GetUserRidesCreatedResolver {
    
    @Query(returns => [Ride], { nullable: true })
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

@ArgsType()
class getLoginArgs {
    @Field()
    email!: string;
    @Field()
    password!: string;
}

@Resolver()
class LoginResolver {

    @Mutation(returns => AuthPayload)
    async login(
        @Args() { email, password }: getLoginArgs,
        @Ctx() { prisma: { user } }: Context,
    ) {
        const currUser = await user.findUnique({
            where: { email }
        });
        if (!currUser) {
            throw new Error('No such user found');
        }
        const valid = await bcrypt.compare(password, currUser.password);
        if (!valid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: currUser.id }, APP_SECRET);
        return { token, currUser };
    }
}

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

    @Mutation(returns => SubscriptionObjType)
    async subscribe(
        @Args() args: SubscriptionArgs,
        @Ctx() { prisma: { user, ride, subscription }, userId }: Context,
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

export { 
    RideMutation, SignupResolver, LoginResolver, SubscriptionResolver, 
    GetUserRidesCreatedResolver, GetUserRidesSubscriptedResolver,
};