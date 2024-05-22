import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityManager } from 'typeorm';

export type IsUniqueInterface = {
  tableName: string;
  column: string;
};

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly em: EntityManager) {}

  validate(value: any, args: ValidationArguments) {
    const { tableName, column } = args.constraints[0];

    return this.em
      .getRepository(tableName)
      .count({ where: { [column]: value } })
      .then((count) => {
        if (count > 0) return false;
        return true;
      });
  }
}

export function IsUnique(
  options: IsUniqueInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
