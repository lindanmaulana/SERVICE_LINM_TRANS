import { LIBRARY_TOKENS, REPOSITORY_TOKENS } from '@/common/const/token.const';
import { TypeBaseMetaDto } from '@/common/dto/pagination.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { User } from '@/modules/master-data/users/domain/entities/user.entity';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import type { UserFilter, UserRepository } from './domain/repositories/user.repository';
import { DeleteUserResponseDto } from './dto/delete-user.dto';
import { GetAllUserDto, GetAllUserResponseDto } from './dto/get-all.dto';
import { GetOneUserResponseDto } from './dto/get-one-user.dto';
import { GetProfileUserResponseDto } from './dto/get-profile-user.dto';
import { UpdateProfileUserDto, UpdateProfileUserResponseDto } from './dto/update-profile-user.dto';
import { UserResponseMapper } from './infrastructure/persistances/user-response.mapper';
import { UsersSharedService } from './users-shared.service';

@Injectable()
export class UsersService {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(REPOSITORY_TOKENS.USER) private readonly userRepository: UserRepository,
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		private userSharedService: UsersSharedService,
	) {}

	async findAll(dto: GetAllUserDto): Promise<GetAllUserResponseDto> {
		const filters: UserFilter = {
			search: dto.search,
			role: dto.role,
			status: dto.status,
			page: dto.page,
			limit: dto.limit,
		};

		const result = await this.userRepository.findAll(filters);

		const meta: TypeBaseMetaDto = {
			page: dto.page,
			limit: dto.limit,
			total: result.total,
			totalPage: Math.ceil(result.total / dto.limit),
			links: Array.from({length: Math.ceil(result.total / dto.limit)}, (_, index) => index + 1)
		}

		return UserResponseMapper.toFindAll(result.users, meta)
	}

	async findProfile(user: JwtPayload): Promise<GetProfileUserResponseDto> {
		const userEntity = await this.findByEmailEntityOrThrow(user.email);

		return UserResponseMapper.toGetProfile(userEntity);
	}

	async findById(id: string): Promise<GetOneUserResponseDto> {
		const result = await this.findByIdEntityOrThrow(id);

		return UserResponseMapper.toGetOne(result);
	}

	async findByEmail(email: string): Promise<GetOneUserResponseDto> {
		const result = await this.findByEmailEntityOrThrow(email);

		return UserResponseMapper.toGetOne(result);
	}

	async create(user: User): Promise<User> {
		const checkUser = await this.userRepository.findByEmail(user.email);
		if (checkUser) throw new ConflictException('Email telah digunakan');

		if (user.password && user.password !== null) {
			const hashPassword = await this.libHash.hash(user.password, 8);
			user.setPassword(hashPassword);
		}

		return await this.userRepository.create(user);
	}

	async updateProfile(user: JwtPayload, dto: UpdateProfileUserDto): Promise<UpdateProfileUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsByEmail(user.email);
		userEntity.update({ name: dto.name });

		const result = await this.userRepository.update(userEntity);
		return UserResponseMapper.toGetProfile(result);
	}

	async delete(userId: string): Promise<DeleteUserResponseDto> {
		const userEntity = await this.userSharedService.validateUserExistsById(userId);

		if (userEntity.deletedAt) throw new BadRequestException('Data user telah di terhapus');
		userEntity.setDeleted();

		await this.userRepository.delete(userEntity);

		return {};
	}

	async findEntityByEmail(email: string): Promise<User | null> {
		return await this.userRepository.findByEmail(email);
	}

	async findEntityById(id: string): Promise<User | null> {
		return await this.userRepository.findById(id);
	}

	async findByIdEntityOrThrow(id: string): Promise<User> {
		const user = await this.findEntityById(id);
		if (!user) throw new NotFoundException('User tidak ditemukan');

		return user;
	}

	async findByEmailEntityOrThrow(email: string): Promise<User> {
		const user = await this.findEntityByEmail(email);

		if (!user) throw new NotFoundException('User tidak ditemukan');

		return user;
	}

	async updatePassword(user: User, password: string): Promise<void> {
		const hashNewPassword = await this.libHash.hash(password, 8);
		user.update({ password: hashNewPassword });

		await this.userRepository.update(user);
	}

	async activateUser(email: string, tx?: any): Promise<void> {
		const repo = tx ? this.userRepository.transaction(tx) : this.userRepository;

		await repo.activate(email);
	}

	async update(user: User, tx?: any): Promise<void> {
		const repo = tx ? this.userRepository.transaction(tx) : this.userRepository;

		await repo.update(user);
	}
}
