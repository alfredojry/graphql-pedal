import { Args, ArgsType, Ctx, Field, Mutation, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { AuthPayload } from "../models/AuthPayload";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../utils";

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

    @Mutation(
        returns => AuthPayload,
        {
            description: 'Resolver para cadastro de novo usuário'
        })
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
 export { SignupResolver };