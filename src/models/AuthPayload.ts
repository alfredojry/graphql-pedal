import { User } from "./User";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
class AuthPayload {
    @Field()
    token!: string;
    @Field(type => User)
    user!: User;
}

export { AuthPayload };