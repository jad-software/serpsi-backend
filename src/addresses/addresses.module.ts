import { Module } from '@nestjs/common';
import { AddressesService } from './Addresses.service';
import { addressProvider } from './providers/address.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...addressProvider, AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
