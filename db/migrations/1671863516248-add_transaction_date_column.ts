import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransactionDateColumn1671863516248
  implements MigrationInterface
{
  name = 'addTransactionDateColumn1671863516248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD "transaction_date" TIMESTAMP NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP COLUMN "transaction_date"`,
    );
  }
}
