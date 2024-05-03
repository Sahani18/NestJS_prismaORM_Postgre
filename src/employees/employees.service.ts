import {
  HttpException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class EmployeesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async create(createEmployeeDto: Prisma.EmployeeCreateInput) {
    const saltOrRounds = 10;
    const password = createEmployeeDto?.password;
    const hashPassword = await bcrypt.hash(password, saltOrRounds);

    const data = {
      ...createEmployeeDto,
      password: hashPassword,
    };

    const user = await this.databaseService.employee.create({
      data,
    });
    if (user) {
      return {
        ...user,
        password: undefined,
      };
    }
  }

  async signin(signInEmployeeDto: Prisma.EmployeeLoginInput) {
    const user = await this.databaseService.employee.findFirst({
      where: {
        email: signInEmployeeDto.email,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const isMatch = await bcrypt.compare(
      signInEmployeeDto.password,
      user?.password,
    );

    if (!isMatch) {
      throw new HttpException('User ID & Password incorrect', 400);
    }
    const payload = { name: user?.name, email: user?.email };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      statusCode: 200,
      message: 'Login successful',
      token: accessToken,
    };
  }

  async findAll(role?: Role) {
    if (role)
      return this.databaseService.employee.findMany({
        where: {
          role,
        },
      });
    return this.databaseService.employee.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.employee.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateEmployeeDto: Prisma.EmployeeUpdateInput) {
    return this.databaseService.employee.update({
      where: {
        id,
      },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.employee.delete({
      where: {
        id,
      },
    });
  }
}

