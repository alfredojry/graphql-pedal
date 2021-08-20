import { Ride } from "./Ride";
import { User } from "./User";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: 'O modelo que describe quando un usuário inscrive-se em um pedal' })
class Subscription {
    @Field(type => Int)
    id!: number;
    ride?: Ride;
    @Field(type => Int)
    ride_id!: number;
    user?: User;
    @Field(type => Int)
    user_id!: number;
    @Field()
    subscription_date!: Date
}

export { Subscription };