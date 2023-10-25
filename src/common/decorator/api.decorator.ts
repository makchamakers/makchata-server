import {
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  HttpStatus,
  All,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Map, Optional } from '../../types/types';

interface IApiOptions {
  path: string | string[];
  description?: string;
  auth?: boolean;
}

interface IApiPropertyOptions {
  type: any;
  description?: string;
  nullable?: boolean;
  defaultValue?: any;
  example?: any;
}

function combinePropertyDecorator(
  ...decorators: PropertyDecorator[]
): PropertyDecorator {
  return function (target: any, key: string) {
    let decorator: Optional<PropertyDecorator>;
    while ((decorator = decorators.shift())) decorator(target, key);
  } as PropertyDecorator;
}

function combineMethodDecorator(
  decorators: MethodDecorator[],
): MethodDecorator {
  return function (target: any, key: string, descriptor: any) {
    let decorator: Optional<MethodDecorator>;
    while ((decorator = decorators.shift())) decorator(target, key, descriptor);
  } as MethodDecorator;
}

type ApiMethodType = (path?: string | string[]) => MethodDecorator;

function getApiDecorator(
  apiMethodType: ApiMethodType,
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return combineMethodDecorator([
    ...(options.auth ? [ApiBearerAuth('access-token')] : []),
    apiMethodType(options.path),
    ApiOperation({
      summary: options.description,
      description: options.description,
    }),
    ApiCreatedResponse({
      description: options.description,
      type: returnTypeFunc(),
      status: HttpStatus.OK,
    }),
    options.auth === true ? UseGuards(AuthGuard()) : null,
    HttpCode(HttpStatus.OK),
  ]);
}

export const GetApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(Get, returnTypeFunc, options);
};

export const PostApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(Post, returnTypeFunc, options);
};

export const PutApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(Put, returnTypeFunc, options);
};

export const PatchApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(Patch, returnTypeFunc, options);
};

export const DeleteApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(Delete, returnTypeFunc, options);
};

export const DuAllApi = function (
  returnTypeFunc: (returns?: void) => any,
  options: IApiOptions,
): MethodDecorator {
  return getApiDecorator(All, returnTypeFunc, options);
};

export const getReturnTypeFunc = (returnType: any) => () => returnType;

export const ApiField = function (
  options: IApiPropertyOptions,
): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      // type: options.type,
      description: options.description,
      required: !options.nullable,
      example: options.example,
    }),
  );
};

export const ApiNestedField = function (
  options: IApiPropertyOptions,
): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      type: options.type,
      description: options.description,
      required: options ? !options.nullable : undefined,
      example: options.example,
    }),
  );
};

export const RestApiField = function (
  options: IApiPropertyOptions,
): PropertyDecorator {
  return ApiProperty({
    description: options.description,
    required: !options.nullable,
    example: options.example,
  });
};

export const ApiEnumField = function (
  options: IApiPropertyOptions,
): PropertyDecorator {
  return combinePropertyDecorator(
    ApiProperty({
      type: options.type,
      enum: options.type,
      enumName: TheEgoApiEnums.findName(options.type),
      description: options.description,
      required: options ? !options.nullable : undefined,
      example: options.example,
    }),
  );
};

export class TheEgoApiEnums {
  private static enums: Map<any> = {};
  static register(name: string, enumType: any): void {
    this.enums[name] = enumType;
  }
  static findEnum(name: string): any | undefined {
    return this.enums[name];
  }
  static findName(enumType: any): string | undefined {
    return Object.keys(this.enums).find((name) => this.enums[name] == enumType);
  }
}
