import 'reflect-metadata';
import { Ctx, Query, Resolver } from "type-graphql";
import { Context } from "node:vm";
import { Ride } from '../models/Ride';

@Resolver()
class RideQuery {

    @Query(returns => [Ride],
        {
            description: 'Consulta de todos os pedais cadastrados'
        })
    async rides(@Ctx() { prisma: { ride } }: Context) {
        const rides = await ride.findMany();
        return rides;
    }
}

export { RideQuery };
