import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";

@ObjectType({ description: 'O modelo pedal' })
class Ride {
    @Field(type => Int)
    id!: number;

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

    created_by!: User

    created_by_id!: number
}

export { Ride };    