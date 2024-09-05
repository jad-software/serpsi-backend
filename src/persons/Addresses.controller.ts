import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { AddressesService } from "./Addresses.service";
import { UpdateAddressDto } from "./dto/updateAddress.dto";

@Controller('addresses')
export class AdressesController {

  constructor(private readonly addresssesService: AddressesService) {}
  @Get(':id')
  async listOneById(@Param('id') id: string) {
    return await this.addresssesService.findAddressById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto){
    return await this.addresssesService.updateAddress(id, updateAddressDto);
  }
}