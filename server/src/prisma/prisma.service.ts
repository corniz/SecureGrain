import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                },
            },
        });
    }
}

//import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
//import { PrismaClient } from '@prisma/client';
//
//@Injectable()
//export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
//  async onModuleInit() {
//    await this.$connect();
//  }
//
//  async onModuleDestroy() {
//    await this.$disconnect();
//  }
//}
