import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

interface UniversalDecoratorOptions {
  summary?: string;
  responseType?: any;
  body?: any;
  includeBearerAuth?: boolean;
  guards?: any;
}


export function UniversalDecorator({
  summary,
  responseType,
  body,
  guards = [],
}: UniversalDecoratorOptions) {
  const decorators = [];

  if (body) {
    decorators.push(
      ApiBody({
        schema: {
          type: 'object',
          properties: body,
        },
      }),
    );
  }

  if (guards.length > 0) {
    decorators.push(UseGuards(...guards));
  }
  if (summary) {
    decorators.push(
      ApiOperation({ summary }),
    );
  }
  if (responseType) {
    decorators.push(
      ApiResponse({ type: responseType }),
    );
  }

  return applyDecorators(...decorators);
}
