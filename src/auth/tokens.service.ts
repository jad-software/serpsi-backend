import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './entities/tokens.entity';
import { data_providers } from '../constants';
import { Id } from 'src/entity-base/vo/id.vo';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @Inject(data_providers.TOKENS_REPOSITORY)
    private tokensRepository: Repository<Token>
  ) {}

  async create(userId: User) {
    const token = this.generateToken();
    const newToken = new Token({ token });
    newToken.user = userId;
    return await this.tokensRepository.save(newToken);
  }

  async use(token: string, callback: Function) {
    const tokenExists = await this.tokensRepository
      .findOneOrFail({
        where: {
          token,
        },
      })
      .catch((err) => {
        throw new BadRequestException('Token not found');
      });

    if (tokenExists.expiredAt < new Date()) {
      await this.tokensRepository.delete(tokenExists.id.id);
      throw new BadRequestException('Token expired');
    }

    callback();
    await this.tokensRepository.delete(tokenExists.id.id);
  }

  private generateToken(length: number = 100): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let token = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      token += charset[array[i] % charset.length];
    }

    return token;
  }
}
