import { Ride } from "./Ride";
import { Subscription } from "./Subscription";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: 'O modelo Usuário' })
class User {
    @Field(type => Int)
    id?: number;

    @Field()
    name!: string;
    
    @Field()
    email!: string;
    
    @Field()
    password!: string;
    
    @Field(type => [Ride], { nullable: true })
    rides_created?: [Ride];

    @Field(type => [Subscription], { nullable: true })
    subscriptions?: [Subscription];
}

export { User };