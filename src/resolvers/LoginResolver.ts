import { Args, ArgsType, Ctx, Field, Mutation, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { AuthPayload } from "../models/AuthPayload";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../utils";


@ArgsType()
class getLoginArgs {
    @Field()
    email!: string;
    @Field()
    password!: string;
}

@Resolver()
class LoginResolver {

    @Mutation(
        returns => AuthPayload,
        {
            description: 'Resolver para login de usuário'
        })
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

export { LoginResolver };