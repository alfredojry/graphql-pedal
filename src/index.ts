import 'reflect-metadata';
import * as tq from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
//import { resolvers } from '@generated/type-graphql';
import { RideQuery } from './resolvers/Query';
import { GetUserRidesCreatedResolver, GetUserRidesSubscriptedResolver, LoginResolver, RideMutation, SignupResolver, SubscriptionResolver } from './resolvers/Mutation';
import { getUserId } from './utils';

const prisma = new PrismaClient();

const app = async () => {
    const schema = await tq.buildSchema(
        { 
            resolvers: [
                RideQuery, 
                RideMutation, 
                SignupResolver, 
                LoginResolver,
                SubscriptionResolver,
                GetUserRidesCreatedResolver,
                GetUserRidesSubscriptedResolver,
            ] 
        }
    );

    const context = ({ req }: any) => {
        return {
            prisma,
            req,
            userId: req && req.headers.authorization
                ? getUserId(req, '')
                : null,
        };
    };

    new ApolloServer({ schema, context}).listen({ port: 4000 }, () => {
        console.log('🚀 Server ready at: http://localhost:4000');
    });
};

app();